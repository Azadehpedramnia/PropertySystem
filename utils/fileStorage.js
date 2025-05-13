// hr-backend/src/utils/fileStorage.js
const multer = require('multer');
const fs     = require('fs');
const path   = require('path');

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose subfolder by mediaType (you’ll POST this as “mediaType”: "3d-model" or "video")
    const { mediaType } = req.body;
    const dest = path.join(UPLOAD_DIR, mediaType);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Prefix with propertyId to avoid collisions
    const { propertyId } = req.body;
    const name = `${propertyId}_${Date.now()}_${file.originalname}`;
    cb(null, name);
  }
});

module.exports = multer({ storage });
