const WebSocket = require('ws')
const config = require('../../config/config')

let forks = 0

module.exports = async () => {
    const { webSocketUrl, productIds } = config.coinBasePro
    const ws = new WebSocket(webSocketUrl)

    // subscribe for BTC-USD
    const subscribeData = {
        "type": "subscribe",
        "channels": [
            {
                "name": "ticker",
                "product_ids": productIds
            }
        ]
    }

    ws.on('open', () => {
        console.log('channel open')

        // subscribe for product tickers
        try {
            ws.send(JSON.stringify(subscribeData))
        } catch (error) {
            console.log('error', error)
        }
    })

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data)

        const ticker = data.type == 'ticker' ? data : {}
        console.log(ticker)

        (async () => {
            // get all notifications from db

            if (forks >= 5) return
            forks++
            /**  
             * loop though notifications
             *  if (check price type == below and the notification.price > ticker.price) send notification
             * 
             *  if (check price type == above and the notification.price < ticker.price) send notification
             *  
             *  once done
            */
           forks--
        })()
    }

    ws.on('close', () => {
        console.log('channel clossed')
    })
}