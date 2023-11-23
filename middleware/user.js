// middleware/user.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");

function user(req, res, next) {
  const userHeader = req.headers.authorization;
  const [bearer, token] = userHeader.split(" ", 2);

  if (typeof userHeader === "undefined") {
    res.status(401).send({ message: "Not authorized" });
  }
  if (bearer !== "Bearer") {
    res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      res.status(401).send({ message: "Not authorized" });
    }

    try {
      req.user = decode;
      const user = await User.findById(decode.id).exec();

      if (user === null) {
        return res.status(401).send({ message: "Not authorized" });
      }

      if (user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = { id: user._id, name: user.name };

      next();
    } catch (error) {
      next(error);
    }
  });
}

module.exports = user;
