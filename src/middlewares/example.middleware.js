const Catcher = require("./async");
const { _ } = require("../utils/common-func");

const ExampleMiddleware = Catcher(async (req, res) => {
    const resp = new Res(res)
    // TO DO
    next()
})

module.exports = ExampleMiddleware;