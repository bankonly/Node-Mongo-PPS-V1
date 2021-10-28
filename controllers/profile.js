const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")

const profile = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);
    return resp.response({ data: req.user });
})


module.exports = profile
