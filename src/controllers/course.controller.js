const Catcher = require("../middlewares/async");
const { Res, _ } = require("../utils/common-func");
const CourseModel = require("codian-academy-model/models/course.model")
const Mongo = require("../utils/mongo-query");
const CourseToolModel = require("codian-academy-model/models/coursetool.model");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");
const AwsFunc = require("../func/aws.func");
const Constant = require("../configs/constant");
const EnrollTypeModel = require("codian-academy-model/models/enrolltype.model");

const CourseController = {
    list: Catcher(async(req, res) => {
        const resp = new Res(res);
        const instructor_id = req.instructor._id
        const select = req.query.select || "name desc thumbnail price is_publish is_approved"
        const found_course = await Mongo.find(CourseModel, { condition: { instructor_id }, paginate: { paginate: req.query }, select })
        return resp.success({ data: found_course });
    }),
    get: Catcher(async(req, res) => {
        const resp = new Res(res);
        const instructor_id = req.instructor._id
        const populate = {
            path: "course_tool_id course_type_id enroll_type_id instructor_id"
        }
        console.log(req.params._id);
        const found_course = await Mongo.find(CourseModel, { condition: { instructor_id, _id: req.params._id }, many: false, populate: populate })
        return resp.success({ data: found_course });
    }),
    create: Catcher(async(req, res) => {
        const resp = new Res(res);

        req.body.instructor_id = req.instructor._id

        const course_tool_id = req.body.course_tool_id
        const course_type_id = req.body.course_type_id
        const enroll_type_id = req.body.enroll_type_id

        await Mongo.findById(CourseToolModel, { _id: course_tool_id })
        await Mongo.findById(CourseTypeModel, { _id: course_type_id })
        await Mongo.findById(EnrollTypeModel, { _id: enroll_type_id })

        const new_course = await CourseModel.create(req.body)

        return resp.success({ data: new_course });
    }),
    update: Catcher(async(req, res) => {
        const resp = new Res(res);

        const course_id = req.params._id
        const found_course = await Mongo.findById(CourseModel, { _id: course_id })

        const course_tool_id = req.body.course_tool_id
        const course_type_id = req.body.course_type_id
        const enroll_type_id = req.body.enroll_type_id

        if (course_tool_id) await Mongo.findById(CourseToolModel, { _id: course_tool_id })
        if (course_type_id) await Mongo.findById(CourseTypeModel, { _id: course_type_id })
        if (enroll_type_id) await Mongo.findById(EnrollTypeModel, { _id: enroll_type_id })

        found_course.set(req.body)
        await found_course.save()

        return resp.success({ data: found_course });
    }),
    update_course_thumpnail: Catcher(async(req, res) => {
        const resp = new Res(res);
        const course_id = req.body.course_id
        const found_course = await Mongo.findById(CourseModel, { _id: course_id })

        if (!_.isFile(req.files, "img")) throw new Error(`400::please add img`)

        const path = Constant.image_path.course_thumbnail + course_id + "/"
        const upload_img = await AwsFunc.upload_img({ file: req.files.img, fileType: "jpg", path, resize: [800] })
        found_course.thumbnail = upload_img

        await found_course.save()

        return resp.success({ data: upload_img });
    }),
    publish_course: Catcher(async(req, res) => {
        const resp = new Res(res);

        const course_id = req.body.course_id
        const is_publish = req.body.is_publish
        const found_course = await Mongo.findById(CourseModel, { _id: course_id })

        found_course.is_publish = is_publish
        await found_course.save()

        return resp.success({});
    }),
    remove: Catcher(async(req, res) => {
        const resp = new Res(res);
        const course_id = req.params._id
        await Mongo.remove(CourseModel, { _id: course_id })
        return resp.success({});
    }),
};

module.exports = CourseController;