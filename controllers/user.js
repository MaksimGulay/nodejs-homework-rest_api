const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    console.log(user);

    if (user !== null) {
      return res.status(409).send({ massage: "User already registered" });
    }

    const passwardHash = await bcrypt.hash(password, 10);
    await User.create({ email, password: passwardHash });
    res.status(201).send({ message: "Registration sucsesfuly" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (user === null) {
      console.log("EMAIL");
      return res.status(401).send({ massage: "email or password is incorect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      console.log("PASSWORD");
      return res.status(401).send({ massage: "email or password is incorect" });
    }

    const tocen = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    res.send({ tocen });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
