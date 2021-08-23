const CourseController = require("../controllers/course.controller");
const PublicController = require("../controllers/public.controller");

const http = require("express").Router();

http.get("/public/list-course", PublicController.list_course);
http.get("/public/list-course/:_id", CourseController.get);
http.get("/public/list-course-type-or-tool/:_id", PublicController.list_course_by_type_or_tool);
http.get("/public/list-enroll-type", PublicController.list_enroll_type);
http.get("/public/list-payment-method", PublicController.list_payment_method);

const PublicRouter = http;
module.exports = PublicRouter;