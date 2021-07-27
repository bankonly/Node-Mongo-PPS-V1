const InstructorController = require("../controllers/Instructor.controller");

const http = require("express").Router();

http.get("/instructor/profile", InstructorController.instructor_profile);
http.post("/instructor/edit-profile", InstructorController.edit_profile);

const InstructorRouter = http;
module.exports = InstructorRouter;
