require('dotenv').config()

module.exports = {
    "database": {
        "dialect": "mysql",
        "host": process.env.DB_HOST,
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "databaseName": process.env.DB_NAME
    },
    "coinBasePro": {
        "webSocketUrl": process.env.COINBASE_WEB_SOCKET_URL,
        "productIds": [
            "BTC-USD",
            "ETH-USD"
        ],
    }
}
