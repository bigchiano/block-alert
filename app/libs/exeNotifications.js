const Notification = require('../models').notification
const UserNotificationChannel = require('../models').userNotificationChannel
const BaseRepository = require('../repositories/sequelize/BaseRepository')
const { sendWhatsappMessage } = require('../utils/twilio')
const { sendTelegramMessage } = require('../utils/telegram')
const { capitalizeFirstLetter, numToCurrency } = require('../utils/jsFunctions')
const { usedChannel } = require('../../config/config')
const chalk = require('chalk')

const sendNotification = async ({
  notificationChannelId,
  notificationChannelName,
  userId,
  alertMsg,
}) => {
  if (notificationChannelName == 'telegram') {
    const userNotificationChannelModel = new BaseRepository(
      UserNotificationChannel
    )
    const userNotiChan = await userNotificationChannelModel.find({
      userId,
      notificationChannelId,
    })
    if (!userNotiChan || !userNotiChan.channelId) return
    sendTelegramMessage(userNotiChan.channelId, alertMsg)
  }
}

const updateNotificationSeenStatus = async (id, seenTarget) => {
  try {
    const notificationModel = new BaseRepository(Notification)
    await notificationModel.update({ id }, { seenTarget })
  } catch (error) {
    console.log(error.message)
  }
}

const typeBelowNotification = async ({
  notification,
  tickerPrice,
  alertMsg,
}) => {
  const {
    id,
    targetPrice,
    seenTarget,
    notificationChannel,
    notificationChannelId,
    userId,
  } = notification

  if (targetPrice < tickerPrice && !seenTarget) {
    // set to seenTarget
    await updateNotificationSeenStatus(id, true)

    sendNotification({
      notificationChannelId,
      notificationChannelName: notificationChannel.name,
      userId,
      alertMsg,
    })
    return
  }

  if (targetPrice >= tickerPrice && seenTarget) {
    // set to not seenTarget
    await updateNotificationSeenStatus(id, false)
    return
  }
}

const typeAboveNotification = async ({
  notification,
  tickerPrice,
  alertMsg,
}) => {
  const {
    id,
    targetPrice,
    seenTarget,
    notificationChannel,
    notificationChannelId,
    userId,
  } = notification

  if (targetPrice > tickerPrice && !seenTarget) {
    // set to seenTarget
    await updateNotificationSeenStatus(id, true)

    sendNotification({
      notificationChannelId,
      notificationChannelName: notificationChannel.name,
      userId,
      alertMsg,
    })
    return
  }

  if (targetPrice <= tickerPrice && seenTarget) {
    // set to not seenTarget
    await updateNotificationSeenStatus(id, false)
    return
  }
}

executeNotifications = async ({ tickerPrice, tickerProductId }) => {
  try {
    const notificationModel = new BaseRepository(Notification)
    const stream = await notificationModel.findAllWithStream({}, [
      'coin',
    ])

    stream.on('data', (chunk) => {
      const notificationsChunk = JSON.parse(chunk.toString())
      if (notificationsChunk.length < 1) return

      notificationsChunk.forEach(async (notification) => {
        const { type, note, targetPrice, coin } = notification
        if (coin.productId !== tickerProductId) return

        const alertMsg = `${capitalizeFirstLetter(
          coin.name
        )} (${coin.symbol.toUpperCase()}) went ${type} ${numToCurrency(
          targetPrice
        )} USD
      ${note ? null && 'Note: ' + note : ''}`

        if (type === 'below') {
          typeBelowNotification({ notification, tickerPrice, alertMsg })
        } else if (type === 'above') {
          typeAboveNotification({ notification, tickerPrice, alertMsg })
        }
      })
    })

    stream.on('end', function () {
      console.log('end of notifications stream')
    })

    stream.on('error', function (err) {
      console.log(err.stack)
    })
  } catch (error) {
    console.log(chalk.yellow(error.message))
  }

  return true
}

module.exports = {
  executeNotifications,
}
