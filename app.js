const express = require("express");
const { InitSocket } = require("./configs/socket");
const { InitialApp, OnEndInitialApp } = require("./configs/app");
const { InitialDatabase } = require("./configs/database");
const error_code = require("./controllers/error_code");
const register = require("./controllers/register");
const login = require("./controllers/login");
const register_validator = require("./validations/register");
const login_validator = require("./validations/login");
const profile = require("./controllers/profile");
const Auth = require("./middlewares/auth");
const send_otp = require("./controllers/send-otp");
const verify_otp = require("./controllers/verify-otp");
const OtpAuth = require("./middlewares/auth-reset-password");
const reset_password = require("./controllers/reset-password");

const app = express()
const router = express.Router()


InitialDatabase();
InitialApp(app);

router.post("/login", login_validator, login)
router.get("/error-code", error_code)
router.post("/register", register_validator, register)
router.post("/send-otp", send_otp)
router.post("/verify-otp", OtpAuth, verify_otp)
router.post("/reset-password", OtpAuth, reset_password)

router.get("/me", Auth, profile)

app.use("/api", router)

OnEndInitialApp(app);
const listener = app.listen(process.env.APP_PORT);
InitSocket(listener);
console.log("Server Started " + process.env.APP_PORT);
