const Catcher = require("../middlewares/async");
const { Res } = require("../utils/common-func");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");
const Mongo = require("../utils/mongo-query");

const CourseTypeController = {
  list: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = "name" || req.query.field
    const found_course_tool = await Mongo.find(CourseTypeModel, { select })
    return resp.success({ data: found_course_tool });
  }),
};

module.exports = CourseTypeController;
