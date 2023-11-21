const jwt = require("jsonwebtoken");

function user(req, res, next) {
  const userHeader = req.headers.authorization;
  console.log(userHeader);
  const [bearer, token] = userHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    res.statud(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
    }
    req.user = decode;
  });
  next();
}

module.exports = user;
