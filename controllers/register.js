const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")
const _ = require("ssv-utils");
const { JwtGenerator } = require("../func/common-func");
const UserModel = require("starter-model-mongo/models/user.model")

const register = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);
    const body = req.body;

    body.password = await _.bcryptFn.hashPassword(body.password);
    const created_user = await UserModel.create(body);

    const payload = { _id: 1 };
    const access_credential = JwtGenerator(payload);

    return resp.response({ data: access_credential })
})


module.exports = register
