const AsyncMiddleware = require("./async");
const { JwtAuth } = require("ssv-middleware");
const _ = require("ssv-utils");
const UserModel = require("starter-model-mongo/models/user.model");

const OtpAuth = AsyncMiddleware(
  async (req, res, next) => await JwtAuth({ model: UserModel, secret_key: process.env.RESET_PWD_SECRET_KEY }).initial(req, res, next),
  false, // useTransaction = false
  true // is middleware = true
);

module.exports = OtpAuth;
