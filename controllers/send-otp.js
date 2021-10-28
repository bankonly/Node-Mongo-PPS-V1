const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")
const UserModel = require("starter-model-mongo/models/user.model");
const OtpFunc = require("../func/mail.func");

const send_otp = AsyncMiddleware(async (req, res, next, opts, commit) => {
    const resp = new Res(res);
    const token = await OtpFunc.send_otp({
        model: UserModel,
        req,
        opts,
    });
    await commit()
    return resp.response({ data: token });
}, true)


module.exports = send_otp
