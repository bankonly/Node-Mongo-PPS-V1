const Catcher = require("../middlewares/async");
const { Res, _ } = require("../utils/common-func");
const CourseModel = require("codian-academy-model/models/course.model")
const Mongo = require("../utils/mongo-query");
const CourseToolModel = require("codian-academy-model/models/coursetool.model");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");

const CourseController = {
  list: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = req.query.select || "name desc thumbnail price is_publish is_approved"
    const found_course = await Mongo.find(CourseModel, { condition: { user_id: req.user._id }, paginate: { paginate: req.query }, select })
    return resp.success({ data: found_course });
  }),
  get: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
  create: Catcher(async (req, res) => {
    const resp = new Res(res);

    req.body.user_id = req.user._id

    const course_tool_id = req.body.course_tool_id
    const course_type_id = req.body.course_type_id

    await Mongo.findById(CourseToolModel, { _id: course_tool_id })
    await Mongo.findById(CourseTypeModel, { _id: course_type_id })

    const new_course = await CourseModel.create(req.body)

    return resp.success({ data: new_course });
  }),
  update: Catcher(async (req, res) => {
    const resp = new Res(res);

    const course_id = req.body.course_id
    const found_course = await Mongo.findById(CourseModel, { _id: course_id })

    if (!_.isFile(req.files, "img")) throw new Error(`400::please add img`)

    return resp.success({});
  }),
  update_course_thumpnail: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
  remove: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
};

module.exports = CourseController;
