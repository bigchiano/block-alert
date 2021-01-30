const UserNotificationChannel = require('../models').userNotificationChannel
const User = require('../models').user
const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepositorry = require('../repositories/sequelize/UserRepository')

const TelegramBot = require('node-telegram-bot-api')
const { app } = require('../../config/config')
const { bot } = require('../utils/telegram')

bot.onText(/\/start/, async (msg) => {
    const username = msg.from.username
    const UserModel = await new BaseRepository(User)
    const newUser = await new UserRepositorry()

    // Check if user already exits
    const user = await UserModel.find({ username })

    if (!user) {
        await newUser.create({
            email: 'hello@gmail.com',
            username,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            password: username
        })
    }

    bot.sendMessage(
        msg.chat.id,
        `*Hi ${msg.from.first_name}*, Welcome to Block Alert Bot! 🤖 \n \n`,
        { parse_mode: 'Markdown' }
      );

    // try {
    //     const userNotificationChanModel = new BaseRepository(UserNotificationChannel)
    //     const userNotification = await userNotificationChanModel.find({setupId})
    //     if (!userNotification) throw new Error(`Setup id is invalid please visit ${app.frontendBaseUrl} to setup your telegram notification with us.`)

    //     const res = await userNotificationChanModel.update({ id: userNotification.id }, {channelId: chatId})

    //     bot.sendMessage(chatId, `Your ${app.name} telegram notification has been set successfully :). You will receive notifications as set on your account`)
    //     return
    // } catch (error) {
    //     bot.sendMessage(chatId, error.message)
    //     return
    // }
})

// bot.on('message', (msg, match) => {
//     const chatId = msg.chat.id
//     if (msg.text.toString().toLowerCase() === '/start') {
//         bot.sendMessage(
//             chatId,
//             `Hello please create an account with us @ ${app.frontendBaseUrl} to further use this bot`
//         )
//     }
//     return
// })
