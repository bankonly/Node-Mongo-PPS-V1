const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")
const _ = require("ssv-utils")
const UserModel = require("starter-model-mongo/models/user.model")
const Mongo = require("mongo-query-orm");

const change_password = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);

    const password = req.body.password;
    const new_password = req.body.new_password;

    if (!password) throw new Error(`400-ER4001`)
    if (!new_password) throw new Error(`400-ER4002`)
    
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
})


module.exports = change_password
