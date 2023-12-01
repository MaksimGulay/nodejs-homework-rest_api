// controllers/user_avatar.js

const fs = require("node:fs/promises");
const path = require("node:path");
const Jimp = require("jimp");

const User = require("../models/user");

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    await fs.rename(
      req.file.path,
      path.join(__dirname, "../public/avatars", req.file.filename)
    );

    const imagePath = path.join(
      __dirname,
      "../public/avatars",
      req.file.filename
    );

    const image = await Jimp.read(imagePath);
    image.resize(250, 250).writeAsync(imagePath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    ).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.send({ avatarURL: req.file.filename });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadAvatar };
