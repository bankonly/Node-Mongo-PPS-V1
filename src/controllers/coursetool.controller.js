const Catcher = require("../middlewares/async");
const { Res } = require("../utils/common-func");
const CourseToolModel = require("codian-academy-model/models/coursetool.model");
const Mongo = require("../utils/mongo-query");

const CourseToolController = {
  list: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = "name" || req.query.field
    const found_course_tool = await Mongo.find(CourseToolModel, { select })
    return resp.success({ data: found_course_tool });
  }),
};

module.exports = CourseToolController;
