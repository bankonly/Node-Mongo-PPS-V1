const AsyncMiddleware = require("../middlewares/async");
const Res = require("async-api-response")

const error_code = AsyncMiddleware(async (req, res) => {
    const resp = new Res(res);
    const error_code = [
        {
            api: "/api/user/register", errors: [{ code: "ER4001", description: "password was empty or invalid data" },
            { code: "ER4002", description: "confirm password was empty or invalid data" },
            { code: "ER4003", description: "email was empty or invalid data" },
            { code: "ER4004", description: "username was empty or invalid data" },
            { code: "ER4005", description: "password and confirm_password not match" },
            { code: "ER4006", description: "password length must have atleast 8 character" },]
        }
    ]
    return resp.response({ data: error_code })
})

module.exports = error_code