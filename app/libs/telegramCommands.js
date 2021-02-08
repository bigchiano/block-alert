const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepository = require('../repositories/sequelize/UserRepository')

const User = require('../models').user
const Coin = require('../models').coin
const Notification = require('../models').notification
const UserNotificationChannel = require('../models').userNotificationChannel

const { capitalizeFirstLetter, numToCurrency } = require('../utils/jsFunctions')
const { bot } = require('../utils/telegram')

const onStart = async (msg) => {
    const username = msg.from.username

    const userModel = new BaseRepository(User)
    const newUser = new UserRepository()
    const userNotificationChanModel = new BaseRepository(
        UserNotificationChannel
    )

    try {
        // Check if user already exits
        const user = await userModel.find({ username })

        if (!user) {
            const user = await newUser.create({
                username,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                password: username
            })

            await userNotificationChanModel.save({
                channelId: msg.chat.id,
                userId: user.user.dataValues.id,
                notificationChannel: 'telegram'
            })
        }

        bot.sendMessage(
            msg.chat.id,
            `*Hi ${msg.from.first_name}*, Welcome to BlockAlert Bot! 🤖 \n \n`,
            { parse_mode: 'Markdown' }
        )

        setTimeout(() => {
            bot.sendMessage(
                msg.chat.id,
                `What do you wanna do today🤗 ?\n\n
                 Use the following actions to set and manage notifications. \n\n
                 /listNotifications (to check all notifications you have set) 👣 \n
                 /listAvailableCoins (to see coins on our list) 🧐\n
                 /help (learn to set notifications) ℹ️\n
                 /donate (to donate to the development of this bot) ❤️
                 /about (to know more about us)`,
                { parse_mode: 'Markdown' }
            )
        }, 1000)
    } catch (error) {
        console.log(error)
        bot.sendMessage(
            msg.chat.id,
            'Hello, i am corrently having some issue with my server. please try again later!!'
        )
    }
}

const onListCoins = async (msg) => {
    const coinModel = new BaseRepository(Coin)

    try {
        const coins = await coinModel.findAll()

        if (coins.length < 1) {
            bot.sendMessage(
                msg.chat.id,
                `We currently do not have any coins listed :(, please try again later!`,
                {
                    parse_mode: 'Markdown'
                }
            )
        }

        let listCoins = ''
        coins.forEach((coin) => {
            listCoins += `${capitalizeFirstLetter(coin.name)}: ${coin.symbol}\n`
        })

        bot.sendMessage(msg.chat.id, `${listCoins}`, {
            parse_mode: 'Markdown'
        })
    } catch (error) {
        console.log(error)
        bot.sendMessage(
            msg.chat.id,
            'Hello, i am corrently having some issue with my server. please try again later!!'
        )
    }
}

const onListNotifications = async (msg) => {
    const username = msg.from.username

    const notificationModel = new BaseRepository(Notification)
    const userModel = new BaseRepository(User)

    try {
        const user = await userModel.find({ username })

        const notifications = await notificationModel.findAll(
            { userId: user.id },
            ['coin']
        )

        let notifications = ''

        if (notifications.length > 0) {
            notifications.forEach((notification) => {
                notifications += `${notification.coin.symbol}-${
                    notification.type
                }: ${numToCurrency(notification.targetPrice)} USD\n`
            })

            bot.sendMessage(msg.chat.id, `${notifications}`, {
                parse_mode: 'Markdown'
            })
        } else {
            bot.sendMessage(
                msg.chat.id,
                `Hello, you have not set any notifications yet!`,
                {
                    parse_mode: 'Markdown'
                }
            )
        }
    } catch (error) {
        console.log(error)
        bot.sendMessage(
            msg.chat.id,
            'Hello, i am corrently having some issue with my server. please try again later!!'
        )
    }
}

const onNotify = async (msg, match) => {
    const req = match[1].split(' ')
    const secondParam = req[0].split('-')
    const coinSymbol = secondParam[0]
    const notifyType = secondParam[1]

    const notificationModel = new BaseRepository(Notification)
    const coinModel = new BaseRepository(Coin)

    try {
        const userModel = await new BaseRepository(User)
        const user = await userModel.find({ username: msg.from.username })
        const coins = await coinModel.find({ symbol: coinSymbol })

        await notificationModel.save({
            type: notifyType,
            targetPrice: req[1],
            notificationChannel: 'telegram',
            coinId: coins.id,
            userId: user.id
        })

        bot.sendMessage(msg.chat.id, `Your notification has been set :)`, {
            parse_mode: 'Markdown'
        })
    } catch (error) {
        console.log(error)
        bot.sendMessage(
            msg.chat.id,
            'Hello, i am corrently having some issue with my server. please try again later!!'
        )
    }
}

const onDelete = async (msg, match) => {
    const req = match[1].split(' ')
    const secondParam = req[0].split('-')
    const coinSymbol = secondParam[0]
    const notifyType = secondParam[1]

    const notificationModel = new BaseRepository(Notification)
    const coinModel = new BaseRepository(Coin)

    try {
        const coins = await coinModel.find({ symbol: coinSymbol })

        await notificationModel.delete({
            type: notifyType,
            targetPrice: req[1],
            notificationChannel: 'telegram',
            coinId: coins.id
        })

        bot.sendMessage(msg.chat.id, `Notification deleted successfully`, {
            parse_mode: 'Markdown'
        })
    } catch (error) {
        console.log(error)
        bot.sendMessage(
            msg.chat.id,
            'Hello, i am corrently having some issue with my server. please try again later!!'
        )
    }
}

const onHelp = async (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `To set notifications first check for available coins and use their key as follows: \n\n 
         To check when a coin goes below certain amount \n /notify {coinKey}-below amount \n\n 
         To check when a coin goes above certain amount \n /notify {coinKey}-above amount \n\n
         Example, let's set a notification for when bitcoin goes below 32,000 USD \n
         /notify btc-below 32000 \n\n I hope you're good to go ;)`,
        { parse_mode: 'Markdown' }
    )
}

const onAbout = async (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Blockylat is a free multi cryptocurrency engine that gives you live updates on cryptocurrencies price on rise or fall events.`,
        { parse_mode: 'Markdown' }
    )
}

const onDonate = (msg) => {
    let chatId = msg.chat.id
    bot.sendMessage(
        chatId,
        `Hello :) do you care so much about us?.\n\nCan send some coins to keep my developers happy and help make me better ❤️ \n\nBitcoin: *bc1q80dntcprztpwqhejeu6vwuxwp3wwaqk7l9qwaz* \n\nEthereum: *0x629817D3b3BfF27c047FDFDd879107FaDE3F4af7* \n\nERC20: *0x629817D3b3BfF27c047FDFDd879107FaDE3F4af7* \n\nBNB: *bnb1jckznag0mh6fqlss4g5qu5ywkdqgm5q4xs8c8z*`,
        {
            parse_mode: 'Markdown'
        }
    )
}

module.exports = {
    onStart,
    onListCoins,
    onListNotifications,
    onNotify,
    onDelete,
    onHelp,
    onDonate,
    onAbout
}
