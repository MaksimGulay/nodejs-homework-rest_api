// routes/api/user.js

const express = require("express");
const userController = require("../../controllers/user");
const user = require("../../middleware/user");
const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, userController.register);
router.post("/login", jsonParser, userController.login);
router.post("/logout", user, userController.logout);
router.get("/current", user, userController.current);
router.get("/verify/:token", userController.verify);

module.exports = router;
