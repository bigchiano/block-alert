const WebSocket = require('ws')
const config = require('../../config/config')
const { webSocketUrl, productIds } = config.coinBasePro
const ws = new WebSocket(webSocketUrl)

const subscribe = () => {
  const subscribeData = {
    type: 'subscribe',
    channels: [
      {
        name: 'ticker',
        product_ids: productIds,
      },
    ],
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

  ws.on('error', (e) => {
    console.log('error occured', e.message)
  })


  return ws
}


module.exports = { subscribe }