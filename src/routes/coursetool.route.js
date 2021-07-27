const CourseToolController = require("../controllers/CourseTool.controller");

const http = require("express").Router();

http.get("/course-tool/list", CourseToolController.list);

const CourseToolRouter = http;
module.exports = CourseToolRouter;
