const CourseTypeController = require("../controllers/CourseType.controller");

const http = require("express").Router();

http.get("/course-type/list", CourseTypeController.list);

const CourseTypeRouter = http;
module.exports = CourseTypeRouter;
