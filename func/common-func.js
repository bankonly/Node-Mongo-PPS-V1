const Jwt = require("jsonwebtoken");

module.exports.JwtGenerator = (payload) => {
    const token = Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_LIFE_TIME });
    const refresh_token = Jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_TOKEN_LIFE_TIME });
    return { token, refresh_token };
};
module.exports.JwtGeneratorResetToken = (payload) => {
    const token = Jwt.sign(payload, process.env.RESET_PWD_SECRET_KEY, { expiresIn: process.env.RESET_PWD_TOKEN_LIFE_TIME });
    return { token };
};
module.exports.GetFullUrl = (req) => `${req.protocol}://${req.headers.host}${req.originalUrl}`;
module.exports.SecToMinute = (secs) => {
    function pad(num) {
        return num
        return ("0" + num).slice(-2);
    }
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return { hours: pad(hours), minutes: pad(minutes), seconds: pad(secs) }

}