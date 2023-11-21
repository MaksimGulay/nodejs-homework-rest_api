// routes/api/user.js

const express = require("express");
const userController = require("../../controllers/user");
const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, userController.register);
router.post("/login", jsonParser, userController.login);

module.exports = router;
