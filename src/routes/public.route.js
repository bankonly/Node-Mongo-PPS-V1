const PublicController = require("../controllers/Public.controller");

const http = require("express").Router();

http.get("/public/list-course", PublicController.list_course);
http.get("/public/list-course-type-or-tool/:_id", PublicController.list_course_by_type_or_tool);
http.get("/public/list-enroll-type", PublicController.list_enroll_type);

const PublicRouter = http;
module.exports = PublicRouter;
