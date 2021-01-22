const express = require('express')
const router = express.Router()
const { add, findAll, findOne } = require('../app/controllers/NotificationChannelController')

/**
 *  Notification Channel routes 
 * **/

/* ADD notification channel to our system. */
router.post('/add', add)
/* GET notification channels listing. */
router.get('/fetch', findAll)
/* GET a notification channel. */
router.get('/get', findOne)

module.exports = router
