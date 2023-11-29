// middleware/upload.js

const path = require("node:path");
const crypto = require("node:crypto");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../tmp"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basaname = path.basename(file.originalname, extname);
    const sufix = crypto.randomUUID();
    cb(null, `${basaname}-${sufix}${extname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
