const multer = require("multer");

// Configure Multer storage (memory storage for buffer uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };
