const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepository = require('../repositories/sequelize/UserRepository')

const User = require('../models').user
const Coin = require('../models').coin
const Notification = require('../models').notification
const { capitalizeFirstLetter, numToCurrency } = require('../utils/jsFunctions')
const { bot } = require('../utils/telegram')

const onStart = async () => {
    const username = msg.from.username
    const userModel = await new BaseRepository(User)
    const newUser = new UserRepository()

    // Check if user already exits
    const user = await userModel.find({ username })

    if (!user) {
        const user = await newUser.create({
            username,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            password: username
        })

        const userNotificationChanModel = new BaseRepository(
            UserNotificationChannel
        )

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
            `What do you wanna do today🤗 ?\n\n_Use the following actions to set and manage notifications._ \n\n/listNotifications 👣 \n/listAvailableCoins 🧐\n/\help (learn to set notifications) ℹ️\n/donate ❤️`,
            { parse_mode: 'Markdown' }
        )
    }, 1000)
}

const onListCoins = async (msg) => {
    const coinModel = new BaseRepository(Coin)
    const coins = await coinModel.findAll()

    let listCoins = ''

    if (coins.length > 0) {
        coins.forEach((coin) => {
            listCoins += `${capitalizeFirstLetter(coin.name)}: ${coin.symbol}\n`
        })

        bot.sendMessage(msg.chat.id, `${listCoins}`, { parse_mode: 'Markdown' })
    } else {
        bot.sendMessage(msg.chat.id, `No available notifications, try again!`, {
            parse_mode: 'Markdown'
        })
    }
}

const onListNotifications = async (msg) => {
    const username = msg.from.username

    const userModel = await new BaseRepository(User)

    // Check if user already exits
    const user = await userModel.find({ username })

    const notificationModel = new BaseRepository(Notification)
    const notifications = await notificationModel.findAll({ userId: user.id }, [
        'coin'
    ])

    let listCoins = ''

    if (notifications.length > 0) {
        notifications.forEach((notification) => {
            listCoins += `${notification.coin.symbol}-${
                notification.type
            }: ${numToCurrency(notification.targetPrice)} USD\n`
        })

        bot.sendMessage(msg.chat.id, `${listCoins}`, { parse_mode: 'Markdown' })
    } else {
        bot.sendMessage(msg.chat.id, `No notification added yet!`, {
            parse_mode: 'Markdown'
        })
    }
}

const onNotify = async (msg, match) => {
    const resp = match[1].split(' ')
    const notificationModel = new BaseRepository(Notification)
    const userModel = await new BaseRepository(User)
    const coinModel = new BaseRepository(Coin)

    const symbol = resp[0].split('-')

    const coins = await coinModel.find({ symbol: symbol[0] })
    const user = await userModel.find({ username: msg.from.username })

    await notificationModel.save({
        type: symbol[1],
        targetPrice: resp[1],
        notificationChannel: 'telegram',
        coinId: coins.id,
        userId: user.id
    })

    bot.sendMessage(msg.chat.id, `Notification created successfully`, {
        parse_mode: 'Markdown'
    })
}

const onDelete = async (msg, match) => {
    const resp = match[1].split(' ')
    const notificationModel = new BaseRepository(Notification)
    const coinModel = new BaseRepository(Coin)

    const symbol = resp[0].split('-')
    const coins = await coinModel.find({ symbol: symbol[0] })

    await notificationModel.delete({
        type: symbol[1],
        targetPrice: resp[1],
        notificationChannel: 'telegram',
        coinId: coins.id
    })

    bot.sendMessage(msg.chat.id, `Notification deleted successfully`, {
        parse_mode: 'Markdown'
    })
}

const onHelp = async (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `To set notifications first check for available coins and use their key as follows: \n\n To check when a coin goes below certain amount \n /notify {coinKey}-below amount \n\n To check when a coin goes above certain amount \n /notify {coinKey}-above amount \n\nExample, let's set a notification for when bitcoin goes below 32,000 USD\n/notify btc-below 32000 \n\n I hope you're good to go ;)`,
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
    onDonate
}
