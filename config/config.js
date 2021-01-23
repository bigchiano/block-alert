require('dotenv').config()

module.exports = {
    // DB configs
    "dialect": "mysql",
    "host": process.env.DB_HOST,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,

    // Other configs
    "coinBasePro": {
        "webSocketUrl": process.env.COINBASE_WEB_SOCKET_URL,
        "productIds": [
            "BTC-USD",
            "ETH-USD"
        ],
    }
}
