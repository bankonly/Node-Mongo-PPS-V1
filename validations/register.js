const AsyncMiddleware = require("../middlewares/async");
const UserModel = require("starter-model-mongo/models/user.model");

const register_validator = AsyncMiddleware(async (req, res, next) => {
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const phone_number = req.body.phone_number;
  const email = req.body.email;
  const username = req.body.username;

  if (!password) throw new Error(`400-ER4001`);
  if (!confirm_password) throw new Error(`400-ER4002`);
  if (!phone_number) throw new Error(`400-ER4003`);
  if (phone_number.length !== 13) throw new Error(`400-ER4004`);
  if (!username) throw new Error(`400-ER4005`);
  if (password !== confirm_password) throw new Error(`400-ER4006`);
  if (password.length < 8) throw new Error(`400-ER4007`);

  if (email) {
    const found_email = await UserModel.findOne({ email, deleted_at: null });
    if (found_email) throw new Error(`400-ERR4008`);
  }

  const found_username = await UserModel.findOne({ username, deleted_at: null });
  if (found_username) throw new Error(`400-ERR4009`);

  const found_phone_number = await UserModel.findOne({ phone_number, deleted_at: null });
  if (found_phone_number) throw new Error(`400-ERR4010`);

  next();
});

module.exports = register_validator;
