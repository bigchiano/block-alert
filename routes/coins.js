const express = require('express')
const router = express.Router()
const { add, findAll, findOne } = require('../app/controllers/CoinController')

/**
 *  Main routes 
 * **/

/* ADD a coin to our system. */
router.post('/add', add)
/* GET coins listing. */
router.get('/fetch', findAll)
/* GET a coin. */
router.get('/get', findOne)

module.exports = router
