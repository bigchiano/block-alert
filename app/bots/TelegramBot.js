const UserNotificationChannel = require('../models').userNotificationChannel
const User = require('../models').user
const BaseRepository = require('../repositories/sequelize/BaseRepository')
const UserRepositorry = require('../repositories/sequelize/UserRepository')

const { bot } = require('../utils/telegram')

bot.onText(/\/start/, async (msg) => {
    const username = msg.from.username
    const UserModel = await new BaseRepository(User)
    const newUser = await new UserRepositorry()

    // Check if user already exits
    const user = await UserModel.find({ username })

        if (!user) {
            const user = await newUser.create({
                username,
                email: null,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                password: username
            })

            const userNotificationChanModel = new BaseRepository(UserNotificationChannel)

            await userNotificationChanModel.save({channelId:  msg.chat.id, userId: user.user.dataValues.id, notificationChannel: "telegram"});

        }

        bot.sendMessage(
            msg.chat.id,
            `*Hi ${msg.from.first_name}*, Welcome to Block Alert Bot! 🤖 \n \n`,
            { parse_mode: 'Markdown' }
        );
})



bot.onText(/\/start/, async (msg) => {
    const username = msg.from.username
    const UserModel = await new BaseRepository(User)
    const newUser = await new UserRepositorry()

    // Check if user already exits
    const user = await UserModel.find({ username })

        if (!user) {
            const user = await newUser.create({
                username,
                email: null,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                password: username
            })

            const userNotificationChanModel = new BaseRepository(UserNotificationChannel)

            await userNotificationChanModel.save({channelId:  msg.chat.id, userId: user.user.dataValues.id, notificationChannel: "telegram"});

        }

        bot.sendMessage(
            msg.chat.id,
            `*Hi ${msg.from.first_name}*, Welcome to Block Alert Bot! 🤖 \n \n`,
            { parse_mode: 'Markdown' }
        );
})