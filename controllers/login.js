const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")
const _ = require("ssv-utils");
const { JwtGenerator } = require("../func/common-func");
const UserModel = require("starter-model-mongo/models/user.model")

const login = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);

    const username = req.body.username
    const password = req.body.password

    const user = await UserModel.findOne({ $or: [{ username }, { email: username }] })
    if (!user) throw new Error(`400-ERR4003`)

    const hashed_password = user.password

    const verify = await _.bcryptFn.verifyPassword(password, hashed_password)
    if (!verify) throw new Error(`400-ERR4004`)

    const payload = { _id: user._id };
    const access_credential = JwtGenerator(payload);

    return resp.response({ data: access_credential });
})


module.exports = login
