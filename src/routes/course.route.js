const CourseController = require("../controllers/course.controller");

const http = require("express").Router();

http.get("/course/list", CourseController.list);
http.get("/course/list/:_id", CourseController.get);
http.post("/course", CourseController.create);
http.post("/course/update-thumbnail", CourseController.update_course_thumpnail);
http.post("/course/publish", CourseController.publish_course);
http.post("/course/edit/:_id", CourseController.update);
http.delete("/course/:_id", CourseController.remove);

const CourseRouter = http;
module.exports = CourseRouter;
