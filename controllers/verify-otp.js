const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response");
const OtpFunc = require("../func/mail.func");

const REGISTER = "register";
const RESETPWD = "resetpwd";

const verify_otp = AsyncMiddleware(async (req, res) => {
  const resp = new Res(res);

  if (![REGISTER, RESETPWD].includes(req.query.type)) throw new Error(`400-FRR4001`);
  const token = await OtpFunc.verify_otp({ req, auth: req.user });

  let response = {};
  if (req.query.type === REGISTER) response = token;

  return resp.response({ data: response });
});

module.exports = verify_otp;
