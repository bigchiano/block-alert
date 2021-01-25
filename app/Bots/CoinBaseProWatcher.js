const config = require('../../config/config')
const axios = require('axios')
const { restApiUrl, productIds } = config.coinBasePro
const { usedChannel } = require('../../config/config')
const { executeNotifications } = require('../Libs/exeNotifications')
const { subscribe } = require('../Libs/webSocket')

const requestWaitTime = 2000
let executingRequest = false

const usedChannelFunction = () => {
  if (usedChannel.restapi) {
    return useRestApi
  } else {
    return useWebSocket
  }
}

const useWebSocket = async () => {
  const ws = subscribe()
  ws.onmessage = async (msg) => {
    if (executingRequest) return
    executingRequest = true

    const ticker = JSON.parse(msg.data)
    if (ticker.type !== 'ticker') return
    const tickerPrice = parseFloat(ticker.price)
    const tickerProductId = ticker.product_id

    const done = await executeNotifications({
      tickerPrice,
      tickerProductId,
    })

    if (done) {
      setTimeout(() => {
        executingRequest = false
      }, requestWaitTime) 
    }
  }
}

const useRestApi = async () => {
  productIds.map(async (productId) => {
    try {
      if (executingRequest) return
      executingRequest = true
      const res = await axios.get(`${restApiUrl}/products/${productId}/ticker`)
      if (!res) return
      const tickerPrice = parseFloat(res.data.price)
      const tickerProductId = productId

      const done = await executeNotifications({
        tickerPrice,
        tickerProductId,
        callBack: useRestApi,
      })

      if (done) {
        setTimeout(() => {
          executingRequest = false
        }, requestWaitTime) 
      }
    } catch (error) {
      console.log('error', error.message)
    }
  })
}

module.exports = usedChannelFunction()
