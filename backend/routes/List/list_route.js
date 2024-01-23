const express = require("express");

const router = express.Router();

const controller = require("../../controller/List/listController");

router.get("/department", controller.getDepartmentList);

router.get("/college", controller.get_college_list);

router.get("/register_plan", controller.get_register_plan_list);

router.get("/state", controller.getStateList);

router.get("/login_all", controller.getLoginAllLists);

module.exports = router;
