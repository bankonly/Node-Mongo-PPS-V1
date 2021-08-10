const InstructorModel = require("codian-academy-model/models/instructor.model");
const CourseTypeModel = require("codian-academy-model/models/coursetype.model");
const Catcher = require("../middlewares/async");
const Mongo = require("../utils/mongo-query");
const { Res, _ } = require("../utils/common-func");
const AwsFunc = require("../func/aws.func");
const Constant = require("../configs/constant");
const ImageFunc = require("../func/image.func");

const InstructorController = {
    become_instructor: Catcher(async (req, res) => {
        const resp = new Res(res);

        const user_id = req.user._id;

        const option = { condition: { user_id }, populate: { path: "course_type_id", select: "name" }, many: false };

        let found_instructor = await Mongo.find(InstructorModel, option);
        if (!found_instructor) {
            await Mongo.findExist(InstructorModel, { condition: { name: req.body.name }, key: "Instructor" });
            req.body.user_id = user_id;
            await Mongo.findById(CourseTypeModel, { _id: req.body.course_type_id });

            await InstructorModel.create(req.body);
            found_instructor = await Mongo.find(InstructorModel, option);
        }

        return resp.success({ data: found_instructor });
    }),
    instructor_profile: Catcher(async (req, res) => {
        const resp = new Res(res);
        const user_id = req.user._id;

        const option = { condition: { user_id }, populate: { path: "course_type_id", select: "name" }, many: false };

        let found_instructor = await Mongo.find(InstructorModel, option);

        return resp.success({ data: found_instructor });
    }),
    edit_profile: Catcher(async (req, res) => {
        const resp = new Res(res);
        const user_id = req.user._id;

        const option = { condition: { user_id }, many: false };
        let found_instructor = await Mongo.find(InstructorModel, option);

        if (_.isFile(req.files, "img")) {
            const upload_img = await AwsFunc.upload_img({ file: req.files.img, fileType: "jpg", path: Constant.image_path.instructor_profile, resize: [800, 256] });
            found_instructor.img = upload_img;
        }

        if (_.isFile(req.files, "cover_img")) {
            const upload_img = await AwsFunc.upload_img({ file: req.files.cover_img, fileType: "jpg", path: Constant.image_path.instructor_cover_img });
            found_instructor.cover_img = upload_img;
        }

        if (req.body.desc) found_instructor.desc = req.body.desc;

        if (req.body.course_type_id) {
            await Mongo.findById(CourseTypeModel, { _id: req.body.course_type_id });
            found_instructor.course_type_id = req.body.course_type_id;
        }

        await found_instructor.save();

        return resp.success({ data: found_instructor });
    }),
};

module.exports = InstructorController;
