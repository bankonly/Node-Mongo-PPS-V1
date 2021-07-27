const CourseController = require("../controllers/Course.controller");

const http = require("express").Router();

http.get("/course/list", CourseController.list);
http.get("/course/list/:_id", CourseController.get);
http.post("/course", CourseController.create);
http.put("/course/:_id", CourseController.update);
http.delete("/course/:_id", CourseController.remove);

const CourseRouter = http;
module.exports = CourseRouter;
