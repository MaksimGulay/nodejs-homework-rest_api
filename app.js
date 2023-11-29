// App.js

require("dotenv").config();
require("./db");
const { HttpError } = require("./helpers");
const user = require("./middleware/user.js");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("node:path");

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/user.js");
const userAvatarRouter = require("./routes/api/user_avatar");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.join(__dirname, "./public/avatars")));

app.use("/api/contacts", user, contactsRouter);
app.use("/api/users", userRouter);
app.use("/api/users", user, userAvatarRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
