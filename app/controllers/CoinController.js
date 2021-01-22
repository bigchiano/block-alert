const BaseRepository = require('../repositories/sequelize/BaseRepository')
const Coin = require('../models').coin

const response = require('../utils/response')

class CoinContoller {
  static async add(req, res) {
    try {
     if (!req.query.name || !req.query.symbol)
        throw new Error('Name and Symbol is required!!')

      const coinModel = new BaseRepository(Coin)
      const findCoin = await coinModel.find({ symbol: req.query.symbol })

      if (findCoin)
        throw new Error('Coin Symbol already exists on our database!!')

      const result = await coinModel.save(req.query)

      return res.status(201).send(response('Coin created successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const coinModel = new BaseRepository(Coin)
      const result = await coinModel.findAll(req.query)
      res.status(200).send(response('Fechted coins successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async findOne(req, res) {
    try {
      const coinModel = new BaseRepository(Coin)
      const result = await coinModel.find(req.query)
      res.status(200).send(response('Fechted coin successfully', result))
    } catch (error) {
      return res.status(400).send(response(error.message, {}, false))
    }
  }

  static async update(req, res) {
    const { coinId } = req.query
    const coinModel = new BaseRepository(Coin)
    const result = await coinModel.update({ coinId }, req.query)
    res.status(200).send(response('Coin updated', result))
  }
}

module.exports = CoinContoller
