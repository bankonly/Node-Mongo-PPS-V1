const AsyncMiddleware = require("../middlewares/async");
const UserModel = require("starter-model-mongo/models/user.model")

const register_validator = AsyncMiddleware(async (req, res, next) => {
    const password = req.body.password
    const confirm_password = req.body.confirm_password
    const email = req.body.email
    const username = req.body.username

    if (!password) throw new Error(`400-ER4001`)
    if (!confirm_password) throw new Error(`400-ER4002`)
    if (!email) throw new Error(`400-ER4003`)
    if (!username) throw new Error(`400-ER4004`)
    if (password !== confirm_password) throw new Error(`400-ER4005`)
    if (password.length < 8) throw new Error(`400-ER4006`)

    const found_email = await UserModel.findOne({ email, deleted_at: null })
    if(found_email) throw new Error(`400-ERR4007`)

    const found_username = await UserModel.findOne({ username, deleted_at: null })
    if(found_username) throw new Error(`400-ERR4008`)

    next()
})

module.exports = register_validator