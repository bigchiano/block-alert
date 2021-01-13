const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepository = require('../repositories/sequelize/UserRepository')
const User = require('../models').user

const response = require('../utils/response')

class UserContoller {
  static async create(req, res) {
    try {
      const newUser = new UserRepository()
      const resp = await newUser.create(req.query)

      const userModel = new BaseRepository(User)
      const result = await userModel.find({ id: resp.user.dataValues.id }, [], {
        exclude: ['tokens', 'password'],
        raw: true
      })

      result.token = resp.token
      return res.status(201).send(response('User created successfully', result))
    } catch (error) {
      return res.status(400).send(error.message)
    }
  }

  static async login(req, res) {
    try {
      const userModel = new UserRepository()
      const result = await userModel.login(req.query)

      if (!result) 
        res.status(400).send(response('Invalid user credentials', {}, false))

      res.status(200).send(response('Login was successful', result))
    } catch (error) {
      return res.status(401).send(response(error.message, {}, false))
    }
  }

  static async findAll(req, res) {
    try {
      const userModel = new BaseRepository(User)
      const result = await userModel.findAll(req.query, [], {
        exclude: ['tokens', 'password'],
      })
      res.status(200).send(response('Fechted users successfully', result))
    } catch (error) {
      return res.status(400).send(error.message)
    }
  }

  static async findOne(req, res) {
    try {
      const userModel = new BaseRepository(User)
      const result = await userModel.find(req.query, [], {
        exclude: ['tokens', 'password'],
      })
      res.status(200).send(response('Fechted users successfully', result))
    } catch (error) {
      return res.status(400).send(error.message)
    }
  }

  static async update(req, res) {
    const result = await UserRepository.update(req.query.userId, req.query)
    res.status(200).send(response('User updated', result))
  }

  static async delete(req, res) {
    const result = await UserRepository.delete(req.params.userId)
    res.status(200).send(response('User deleted', result))
  }
}

module.exports = new UserContoller()
