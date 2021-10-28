const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response");
const OtpFunc = require("../func/mail.func");

const verify_otp = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);
    await OtpFunc.verify_otp({ req, auth: req.user });
    return resp.response({});
})


module.exports = verify_otp
