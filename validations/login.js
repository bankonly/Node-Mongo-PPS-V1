const AsyncMiddleware = require("../middlewares/async");

const login_validator = AsyncMiddleware(async (req, res, next) => {
    const password = req.body.password
    const username = req.body.username

    if (!password) throw new Error(`400-ER4001`)
    if (!username) throw new Error(`400-ER4002`)

    next()
})

module.exports = login_validator