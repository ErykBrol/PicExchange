const multer = require('multer');
const path = require('path');

const storageConfig = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'));
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   },
});

const fileExtFilter = (req, file, cb) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

const maxFileSize = 10 * 1000 * 1000;
module.exports = multer({ storage: storageConfig, fileFilter: fileExtFilter, limits: { fileSize: maxFileSize } });
