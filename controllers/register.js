const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response");
const _ = require("ssv-utils");
const { JwtGenerator } = require("../func/common-func");
const UserModel = require("starter-model-mongo/models/user.model");
const OtpFunc = require("../func/mail.func");

const register = AsyncMiddleware(async (req, res, next, opts, commit) => {
  const resp = new Res(res);
  const body = req.body;

  body.password = await _.bcryptFn.hashPassword(body.password);
  await UserModel.create(body);

  const token = await OtpFunc.send_otp({
    model: UserModel,
    req,
    opts,
    conf: { phone_number: req.body.phone_number },
    to: req.body.phone_number,
  });

  await commit();
  return resp.response({ data: token });
}, true);

module.exports = register;
