// conrollers/user.js

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userShema = require("../schemas/user");
const sendEmail = require(".././helpers/sendEmail");
const crypto = require("node:crypto");

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const validation = userShema.validate(req.body);
    if (validation.error) {
      const errorMessage = validation.error.details
        .map((error) => error.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: `Validation Error: ${errorMessage}` });
    }

    const user = await User.findOne({ email }).exec();

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwardHash = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomUUID();
    await sendEmail({
      to: email,
      subject: "Welcome to your contacts book",
      html: `To confirm your registration please click on <a href="http://localhost:3000/api/users/verify/${verifyToken}">link</a>`,
      text: `To cofrirm your registration please click on the link http://localhost:3000/api/users/verify/${verifyToken}`,
    });

    const newUser = await User.create({
      email,
      verifyToken,
      password: passwardHash,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const validation = userShema.validate(req.body);
    if (validation.error) {
      const errorMessage = validation.error.details
        .map((error) => error.message)
        .join(", ");
      return res
        .status(400)
        .json({ message: `Validation Error: ${errorMessage}` });
    }
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).json({ massage: "Email or password is wrong" });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    await User.findByIdAndUpdate(user._id, { token }).exec();
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verifyToken: token }).exec();

    if (user === null) {
      return res.status(404).send({ message: "Not foundd" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });

    res.send({ massage: "Email confirm succesfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  current,
  verify,
};
