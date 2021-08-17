const CourseModel = require("codian-academy-model/models/course.model");
const CoursePurchaseModel = require("codian-academy-model/models/coursepurchase.model");
const CourseVideoModel = require("codian-academy-model/models/coursevideo.model");
const EnrollTypeModel = require("codian-academy-model/models/enrolltype.model");
const PaymentMethodModel = require("codian-academy-model/models/paymentmethod.model");
const Catcher = require("../middlewares/async");
const { Res, GetStatusId } = require("../utils/common-func");
const Mongo = require("../utils/mongo-query");

const populate_course_purchase = [{
    path: "enroll_type_id course_id status",
    select: "name name_en name_la"
}]

const CoursePurchaseController = {
    list: Catcher(async(req, res) => {
        const resp = new Res(res);
        const cond = { user_id: req.user._id }
        const select = "sub_total is_approved status"
        const found_course_purchase = await Mongo.find(CoursePurchaseModel, { condition: cond, paginate: { paginate: req.query }, populate: populate_course_purchase, select })
        return resp.success({ data: found_course_purchase });
    }),
    get_course_video: Catcher(async(req, res) => {
        const resp = new Res(res);

        const course_id = req.body.course_id

        const found_course_purchase = await Mongo.find(CoursePurchaseModel, { condition: { user_id: req.user._id, course_id }, many: false, throw_error: true })
        if (!found_course_purchase.is_approved) throw new Error(`400::Please ensure you've already complete your payment, or contact your Instructor`)

        const select = req.query.select || "desc video_time title episode video_path snipped_fil thumbnail"
        const found_video = await Mongo.find(CourseVideoModel, { condition: { course_id }, paginate: { paginate: req.query }, select })
        return resp.success({ data: found_video });
    }),
    create: Catcher(async(req, res) => {
        const resp = new Res(res);
        // CoursePurchaseModel

        const payment_method_id = req.body.payment_method_id
        const course_id = req.body.course_id

        const found_course = await Mongo.findById(CourseModel, { _id: course_id })
            // if (found_course.user_id.toString() === req.user._id.toString()) {
            //   throw new Error(`400::Purchase failed, Seem like you trying to purchase your own course`)
            // }

        const enroll_type_id = found_course.enroll_type_id


        await Mongo.findById(PaymentMethodModel, { _id: payment_method_id })
        await Mongo.findById(EnrollTypeModel, { _id: enroll_type_id })

        const { _id: pending_status } = await GetStatusId(1)

        req.body.price = found_course.price
        req.body.total = found_course.price
        req.body.sub_total = found_course.price
        req.body.user_id = req.user._id
        req.body.course_id = course_id
        req.body.status = pending_status
        req.body.enroll_type_id = enroll_type_id

        await CoursePurchaseModel.create(req.body)

        return resp.success({});
    }),
    update: Catcher(async(req, res) => {
        const resp = new Res(res);
        return resp.success({});
    }),
    remove: Catcher(async(req, res) => {
        const resp = new Res(res);
        return resp.success({});
    }),
};

module.exports = CoursePurchaseController;