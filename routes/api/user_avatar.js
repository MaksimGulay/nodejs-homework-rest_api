// roures/api/user_avatar.js

const express = require("express");

const UserAvatarController = require("../../controllers/user_avatar");

const upload = require("../../middleware/upload");

const router = express.Router();

router.patch(
  "/avatars",
  upload.single("avatarURL"),
  UserAvatarController.uploadAvatar
);

module.exports = router;
