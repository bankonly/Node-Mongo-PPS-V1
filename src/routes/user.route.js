const InstructorController = require("../controllers/instructor.controller");
const UserController = require("../controllers/user.controller");
const UserValidator = require("../validations/user.validation");

const http = require("express").Router();

http.get("/user/profile", UserController.profile);
http.post("/user/change-password", UserValidator.changePassword, UserController.changePassword);
http.post("/user/become-instructor", InstructorController.become_instructor);

const UserRouter = http;
module.exports = UserRouter;
