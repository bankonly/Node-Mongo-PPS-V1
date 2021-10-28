const AsyncMiddleware = require("./async");
const { JwtAuth } = require("ssv-middleware");
const UserModel = require("starter-model-mongo/models/user.model");

const Auth = AsyncMiddleware(
  async (req, res, next) => await JwtAuth({ model: UserModel, secret_key: process.env.SECRET_KEY }).initial(req, res, next),
  false, // useTransaction = false
  true // is middleware = true
);

module.exports = Auth;
