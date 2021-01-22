const BaseRepository = require('../repositories/sequelize/BaseRepository')
const NotificationChannel = require('../models').notificationChannel

const response = require('../utils/response')

class NotificationChannelContoller {
  static async add(req, res) {
    try {
     if (!req.query.name)
        throw new Error('Notification channel name is required!!')

      const notiChanModel = new BaseRepository(NotificationChannel)
      const findNotiChan = await notiChanModel.find({ name: req.query.name })

      if (findNotiChan)
        throw new Error('Notification Channel name already exists on our database!!')

      const result = await notiChanModel.save(req.query)

      return res.status(201).send(response('Notification created successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const notiChanModel = new BaseRepository(NotificationChannel)
      const result = await notiChanModel.findAll(req.query)
      res.status(200).send(response('Fechted notification channels successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findOne(req, res) {
    try {
      const notiChanModel = new BaseRepository(NotificationChannel)
      const result = await notiChanModel.find(req.query)
      res.status(200).send(response('Fechted notification channel successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async update(req, res) {
    const { notificationChannelId } = req.query
    const notiChanModel = new BaseRepository(NotificationChannel)
    const result = await notiChanModel.update({ notificationChannelId }, req.query)
    res.status(200).send(response('Notification channel updated', result))
  }
}

module.exports = NotificationChannelContoller
