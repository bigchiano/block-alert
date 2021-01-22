const express = require('express')
const router = express.Router()

// Handlers
const usersRouter = require('./users')
const coinsRouter = require('./coins')
const notificationChannelsRouter = require('./notificationChannels')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/', function (req, res, next) {
  res.send({ title: 'Express' })
})

const routers = [
  {
    path: '/',
    handler: router,
  },
  {
    path: '/users',
    handler: usersRouter,
  },
  {
    path: '/coins',
    handler: coinsRouter,
  },
  {
    path: '/notification-channels',
    handler: notificationChannelsRouter,
  },
]

module.exports = routers
