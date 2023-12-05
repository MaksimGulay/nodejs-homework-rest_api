// middleware/user.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");

function user(req, res, next) {
  const userHeader = req.headers.authorization;
  const [bearer, token] = userHeader.split(" ", 2);

  if (typeof userHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Not authorized" });
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

      req.user = { id: user._id, email: user.email };

      next();
    } catch (error) {
      return next(error);
    }
  });
}

module.exports = user;
