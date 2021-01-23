const WebSocket = require('ws')
const config = require('../../config/config')
const chalk = require('chalk')

const Notification = require('../models').notification
const BaseRepository = require('../repositories/sequelize/BaseRepository')

let forks = 0
const openChannel = async () => {
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

    ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data)
        console.log(data);
        if (data.type !== 'ticker') return

        const ticker = data
        const tickerPrice = parseFloat(ticker.price)

        // get all notifications from db
        if (forks >= 5) return
        forks++

       try {
           const notificationModel = new BaseRepository(Notification)
           const notifications = await notificationModel.findAll()
            
           notifications.forEach(notf => {
               const { id, coinId, type, targetPrice, seenTarget, coin } = notf
               if (coin.productId !== ticker.product_id) return

                const alertMsg = `Alert:: ${coinId} went ${type} ${targetPrice}`
                //   for debuging, remove soon
                //   console.log(chalk.blue('Incoming message .......'));
                //   console.log(chalk.bgBlue('check price', targetPrice));
                //   console.log(chalk.bgBlue('current price', tickerPrice));
                //   console.log(chalk.bgBlue('notified', seenTarget));
                //   console.log(chalk.bgBlue('check for', type));

                if (targetPrice < tickerPrice && !seenTarget && type === 'below') {
                    console.log(chalk.green(alertMsg))
                    // set to seenTarget
                    notificationModel.update({ id }, { seenTarget: true })
                    return
                }


                if (targetPrice > tickerPrice && !seenTarget && type === 'above') {
                    console.log(chalk.green(alertMsg))
                    // set to seenTarget
                    notificationModel.update({ id }, { seenTarget: true })
                    return
                }

                if (type === 'below' && targetPrice >= tickerPrice && seenTarget) {
                    // set to not seenTarget
                    notificationModel.update({ id }, { seenTarget: false })
                    console.log('reset alert for below check');
                    return
                }

                if (type === 'above' && targetPrice <= tickerPrice && seenTarget) {
                    // set to not seenTarget
                    notificationModel.update({ id }, { seenTarget: false })
                    console.log('reset alert for above check');
                    return
                }

           })

           forks--
       } catch (error) {
           console.log(error.message);
       }
    }

    ws.on('error', (e) => {
        console.log('error occured', e.message)
    })

    ws.on('close', () => {
        console.log('channel clossed')
    })
}

module.exports = openChannel

