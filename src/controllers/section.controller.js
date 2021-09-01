const Catcher = require("../middlewares/async");
const { Res } = require("../utils/common-func");
const SectionModel = require("codian-academy-model/models/coursesection.model");
const Mongo = require("../utils/mongo-query");
const CourseModel = require("codian-academy-model/models/course.model");

const SectionController = {
    get: Catcher(async(req, res) => {
        const resp = new Res(res);
        const course_id = req.params._id
        await Mongo.findById(CourseModel, { _id: course_id })
        const sections = await Mongo.find(SectionModel, { condition: { course_id } })
        return resp.success({ data: sections });
    }),
    create: Catcher(async(req, res) => {
        const resp = new Res(res);
        const course_id = req.body.course_id
        await Mongo.findById(CourseModel, { _id: course_id })

        let new_section = await Mongo.find(SectionModel, { condition: { name: req.body.name, course_id }, many: false })
        if (!new_section) {
            new_section = await SectionModel.create(req.body)
        }

        return resp.success({ data: new_section });
    }),
    update: Catcher(async(req, res) => {
        const resp = new Res(res);
        const section_id = req.params._id
        const course_id = req.body.course_id
        await Mongo.findById(CourseModel, { _id: course_id })
        const section = await Mongo.findById(SectionModel, { _id: section_id })
        section.set(req.body)
        await section.save()
        return resp.success({ data: section });
    }),
    remove: Catcher(async(req, res) => {
        const resp = new Res(res);
        const section_id = req.params._id
        await Mongo.remove(SectionModel, { _id: section_id })
        return resp.success({});
    }),
};

module.exports = SectionController;