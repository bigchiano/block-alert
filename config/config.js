require('dotenv').config()

module.exports = {
    // DB configs
    "dialect": "mysql",
    "host": process.env.DB_HOST,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "logging": false,

    // Other configs
    "app": {
        "frontendBaseUrl": process.env.FRONTEND_BASE_URL,
        "name": process.env.APP_NAME
    },
    "coinBasePro": {
        "webSocketUrl": process.env.COINBASE_WEB_SOCKET_URL,
        "productIds": [
            "BTC-USD",
            "ETH-USD"
        ],
    },
    "twilio": {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN
    },
    "telegram": {
        "botToken": process.env.TELEGRAM_BOT_TOKEN,
        "botUrl": process.env.TELEGRAM_BOT_URL
    }
}
