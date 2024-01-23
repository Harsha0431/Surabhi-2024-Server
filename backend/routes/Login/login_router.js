const express = require("express");

const router = express.Router();

const controller = require("../../controller/Login/login_controller");

router.post("/register", controller.signup_controller);

router.post("/login", controller.login_controller);

router.post("/verify_token", controller.tokenAuthController);

module.exports = router