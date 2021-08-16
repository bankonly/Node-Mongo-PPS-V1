const Catcher = require("../middlewares/async");
const { Res } = require("../utils/common-func");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");
const Mongo = require("../utils/mongo-query");

const CourseTypeController = {
    list: Catcher(async(req, res) => {
        const resp = new Res(res);
        const select = req.query.field || "name"
        const found_course_tool = await Mongo.find(CourseTypeModel, { select, paginate: { paginate: req.query } })
        return resp.success({ data: found_course_tool });
    }),
};

module.exports = CourseTypeController;