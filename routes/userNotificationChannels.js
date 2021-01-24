const express = require('express')
const router = express.Router()
const { create, findAll, findOne } = require('../app/controllers/UserNotificationChannelController')
const auth = require('../app/middlewares/auth')

/**
 *  Notification Channel routes 
 * **/

/* CREATE user notification channel to our system. */
router.post('/create', auth, create)
/* GET notification channels listing. */
router.get('/fetch', findAll)
/* GET a notification channel. */
router.get('/get', findOne)

module.exports = router
