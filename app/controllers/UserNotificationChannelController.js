const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserNotificationChannel = require('../models').userNotificationChannel

const response = require('../utils/response')
const { telegram } = require('../../config/config')

class NotificationChannelContoller {
  static async create(req, res) {
    try {
      const userNotiChanModel = new BaseRepository(UserNotificationChannel)
      const findUserNotiChan = await userNotiChanModel.find({ notificationChannelId: req.query.notificationChannelId })
      
      const setupId = Math.random().toString(36).substring(3)
      req.query.setupId = setupId
      req.query.userId = req.user.id

      if (findUserNotiChan) {
        await userNotiChanModel.update({ notificationChannelId: req.query.notificationChannelId }, req.query)
      } else {
        await userNotiChanModel.save(req.query)
      }

      const result = {
        link: `${telegram.botUrl}?start=${setupId}`,
        setupId
      }

      return res.status(201).send(response('Use setupId to start chat with telegram bot', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const userNotiChanModel = new BaseRepository(NotificationChannel)
      const result = await userNotiChanModel.findAll(req.query)
      res.status(200).send(response('Fechted notification channels successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findOne(req, res) {
    try {
      const userNotiChanModel = new BaseRepository(NotificationChannel)
      const result = await userNotiChanModel.find(req.query)
      res.status(200).send(response('Fechted notification channel successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async update(req, res) {
    const { notificationChannelId } = req.query
    const userNotiChanModel = new BaseRepository(NotificationChannel)
    const result = await userNotiChanModel.update({ notificationChannelId }, req.query)
    res.status(200).send(response('Notification channel updated', result))
  }
}

module.exports = NotificationChannelContoller
