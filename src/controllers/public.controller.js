const CourseModel = require("codian-academy-model/models/course.model");
const EnrollTypeModel = require("codian-academy-model/models/enrolltype.model");
const Catcher = require("../middlewares/async");
const { Res, _ } = require("../utils/common-func");
const Mongo = require("../utils/mongo-query");

const PublicController = {
  list_course: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = req.query.select || "name desc thumbnail price is_publish is_approved enroll_type_id"

    const search_field = ['name', 'desc', 'course_for', 'tags']

    const cond = { is_publish: true }
    const found_course = await Mongo.find(CourseModel, { condition: cond, paginate: { paginate: req.query }, select, search: { key: search_field, key_word: req.query.q } })
    return resp.success({ data: found_course });
  }),
  list_course_by_type_or_tool: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = req.query.select || "name desc thumbnail price is_publish is_approved enroll_type_id"

    const target_id = req.params._id
    if (!_.isObjectId(target_id)) throw new Error(`400::please add target field to process`)

    const search_field = ['name', 'desc', 'course_for', 'tags']

    const cond = { $and: [{ $or: [{ course_type_id: target_id }, { course_tool_id: target_id }] }, { is_publish: true }] }
    const found_course = await Mongo.find(CourseModel, { condition: cond, paginate: { paginate: req.query }, select, search: { key: search_field, key_word: req.query.q } })
    return resp.success({ data: found_course });
  }),
  list_enroll_type: Catcher(async (req, res) => {
    const resp = new Res(res);
    const select = "name" || req.query.field
    const found_enroll = await Mongo.find(EnrollTypeModel, { select })
    return resp.success({ data: found_enroll });
  }),
  update: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
  remove: Catcher(async (req, res) => {
    const resp = new Res(res);
    return resp.success({});
  }),
};

module.exports = PublicController;
