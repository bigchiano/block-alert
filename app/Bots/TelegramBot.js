const UserNotificationChannel = require('../models').userNotificationChannel
const BaseRepository = require('../repositories/sequelize/BaseRepository')

const TelegramBot = require('node-telegram-bot-api');
const { app } = require('../../config/config');
const { bot } = require('../utils/telegram')

bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const setupId = match[1]

    try {
        const userNotificationChanModel = new BaseRepository(UserNotificationChannel)
        const userNotification = await userNotificationChanModel.find({setupId})
        if (!userNotification) throw new Error(`Setup id is invalid please visit ${app.frontendBaseUrl} to setup your telegram notification with us.`)
       
        const res = await userNotificationChanModel.update({ id: userNotification.id }, {channelId: chatId})
    
        bot.sendMessage(chatId, `Your ${app.name} telegram notification has been set successfully :). You will receive notifications as set on your account`)
        return
    } catch (error) {
        bot.sendMessage(chatId, error.message)
        return
    }
})

bot.on('message', (msg, match) => {
    const chatId = msg.chat.id
    if (msg.text.toString().toLowerCase() === "/start") {
        bot.sendMessage(chatId, `Hello please create an account with us @ ${app.frontendBaseUrl} to further use this bot`)
    }
    return
})