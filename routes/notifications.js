const express = require('express')
const router = express.Router()
const { create, update, findAll, findOne } = require('../app/controllers/NotificationController')

// middlewares
// const validateUser = require('../app/middlewares/validators/user/validateUser')
const auth = require('../app/middlewares/auth')

/**
 *  User routes 
 * **/

/* CREATE notification. */
router.post('/create', create)
/* UPDATE notification. */
router.post('/update', update)
/* GET notifications listing. */
router.get('/fetch', findAll)
/* GET a notification. */
router.get('/get', findOne)

module.exports = router
