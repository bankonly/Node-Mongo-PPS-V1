const Catcher = require("./async");
const { _ } = require("../utils/common-func");
const InstructorModel = require("codian-academy-model/models/instructor.model");
const Mongo = require("../utils/mongo-query");

const InstructorMiddleware = Catcher(async (req, res, next) => {
    const user_id = req.user._id
    const found_instructor = await Mongo.find(InstructorModel, { condition: { user_id }, error_code: 401, throw_error: true, many: false })
    req.body.instructor = found_instructor
    next()
})

module.exports = InstructorMiddleware;