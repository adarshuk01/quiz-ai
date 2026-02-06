const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // 👈 REQUIRED
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;
