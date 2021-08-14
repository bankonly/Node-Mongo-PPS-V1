const CoursePurchaseController = require("../controllers/coursepurchase.controller");

const http = require("express").Router();

http.get("/course-purchase/list", CoursePurchaseController.list);
http.get("/course-purchase/list-video/:_id", CoursePurchaseController.get_course_video);
http.post("/course-purchase", CoursePurchaseController.create);
http.put("/course-purchase/:_id", CoursePurchaseController.update);
http.delete("/course-purchase/:_id", CoursePurchaseController.remove);

const CoursePurchaseRouter = http;
module.exports = CoursePurchaseRouter;
