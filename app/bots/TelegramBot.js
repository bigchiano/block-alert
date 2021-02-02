const UserNotificationChannel = require('../models').userNotificationChannel
const Notification = require('../models').notification
const Coin = require('../models').coin
const { capitalizeFirstLetter } = require('../utils/jsFunctions')

const User = require('../models').user
const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepositorry = require('../repositories/sequelize/UserRepository')

const { bot } = require('../utils/telegram')

bot.onText(/\/start/, async (msg) => {
    const username = msg.from.username
    const UserModel = await new BaseRepository(User)
    const newUser = await new UserRepositorry()

    // Check if user already exits
    const user = await UserModel.find({ username })

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
    }, 0)
})

bot.onText(/\/listAvailableCoins/, async (msg) => {
    const coinModel = new BaseRepository(Coin)
    const coins = await coinModel.findAll({}, [], { raw: true })

    let listCoins = ''

    coins.forEach((coin) => {
        listCoins += `${capitalizeFirstLetter(coin.name)}: ${coin.symbol}\n`
    })

    bot.sendMessage(msg.chat.id, `${listCoins}`, { parse_mode: 'Markdown' })
})
