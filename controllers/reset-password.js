const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")
const OtpFunc = require("../func/mail.func");
const UserModel = require("starter-model-mongo/models/user.model")

const reset_password = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);
    await OtpFunc.reset_password(UserModel, { req });
    return resp.response({});
})


module.exports = reset_password
