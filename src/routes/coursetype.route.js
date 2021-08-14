const CourseTypeController = require("../controllers/courseType.controller");

const http = require("express").Router();

http.get("/course-type/list", CourseTypeController.list);

const CourseTypeRouter = http;
module.exports = CourseTypeRouter;
