const AsyncMiddleware = require("../middlewares/async");
const { JwtGenerator } = require("../func/common-func");
const Res = require("async-api-response")
const _ = require("ssv-utils")
const UserModel = require("codian-academy-model/models/user.model");
const Mongo = require("mongo-query-orm");

const UserController = {

    changePassword: AsyncMiddleware(async (req, res) => {
        const resp = new Res(res);

        const password = req.body.password;
        const new_password = req.body.new_password;

        // Find old password
        const found_user = await Mongo.findById(UserModel, {
            _id: req.user._id,
            select: "-__v",
        });

        const verify_password = await _.bcryptFn.verifyPassword(password, found_user.password);
        if (!verify_password) throw new Error(`400::invalid password`);

        found_user.password = await _.bcryptFn.hashPassword(new_password);
        await found_user.save();

        return resp.response({});
    }),
};

module.exports = UserController;
