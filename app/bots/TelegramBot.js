const {
    onStart,
    onListCoins,
    onListNotifications,
    onNotify,
    onDelete,
    onHelp,
    onDonate,
    onAbout
} = require('../libs/telegramCommands')

const { bot } = require('../utils/telegram')

bot.onText(/\/start/, onStart)
bot.onText(/\/listAvailableCoins/, onListCoins)
bot.onText(/\/listNotifications/, onListNotifications)
bot.onText(/\/notify (.+)/, onNotify)
bot.onText(/\/delete (.+)/, onDelete)
bot.onText(/\/help/, onHelp)
bot.onText(/\/donate/, onDonate)
bot.onText(/\/about/, onAbout)
