const TelegramBot = require('node-telegram-bot-api')
const { telegram } = require('../../config/config')

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(telegram.botToken, {polling: true})

exports.bot = bot

exports.sendTelegramMessage = (chatId = "", msg = "no message") => {
    if (!chatId || !msg) return
    bot.sendMessage(chatId, msg)
    return
}

