const IndexRouter = require("./index");
const UserRouter = require("./user.route");
const SessionRoute = require("./session.route");
const Auth = require("../middlewares/auth");
const OtpAuth = require("../middlewares/auth-reset-password");
const OtpRouter = require("./otp.route");
const InstructorRouter = require("./instructor.route");
const CourseTypeRouter = require("./coursetype.route");
const CourseToolRouter = require("./coursetool.route");
const InstructorMiddleware = require("../middlewares/instructor.middleware");
const CourseRouter = require("./course.route");
const VideoRouter = require("./video.route");
const PublicRouter = require("./public.route");
const CoursePurchaseRouter = require("./coursepurchase.route");

const InitialRoute = (app) => {
    app.use("/api" /* [NO AUTH] */ , [IndexRouter, PublicRouter, CourseToolRouter, CourseTypeRouter]);
    app.use("/api/otp", OtpAuth, [OtpRouter]);
    app.use("/api", Auth, [UserRouter, SessionRoute, CoursePurchaseRouter]);
    app.use("/api", InstructorMiddleware, [InstructorRouter, CourseRouter, VideoRouter]);
};

module.exports = InitialRoute;