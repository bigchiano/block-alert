const BaseRepository = require('../repositories/sequelize/BaseRepository')
const Notification = require('../models').notification

const response = require('../utils/response')

class NotificationContoller {
  static async create(req, res) {
    try {
  
      req.query.userId = req.query.userId
      req.query.seenTarget = false

      const notificationModel = new BaseRepository(Notification)
      const result = await notificationModel.save(req.query)

      return res.status(201).send(response('Notification created successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const notificationModel = new BaseRepository(Notification)
      const result = await notificationModel.findAll(req.query, ['coin', 'userNotificationChannels'])
      return res.status(200).send(response('Fechted notification successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findOne(req, res) {
    try {
      const notificationModel = new BaseRepository(Notification)
      const result = await notificationModel.find(req.query)
      res.status(200).send(response('Fechted notification successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async update(req, res) {
    const { notificationId } = req.query
    const notificationModel = new BaseRepository(Notification)
    const result = await notificationModel.update({ notificationId }, req.query)
    res.status(200).send(response('Notification updated', result))
  }
}

module.exports = NotificationContoller
