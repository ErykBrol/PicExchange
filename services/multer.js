const multer = require('multer');
const path = require('path');

let storageConfig = null;
if (process.env.NODE_ENV === 'production') {
   const aws = require('aws-sdk');
   const multerS3 = require('multer-s3');
   const keys = require('../config/keys');

   const s3 = new aws.S3({
      secretAccessKey: keys.s3AccessSecret,
      accessKeyId: keys.s3AccessKey,
      region: 'us-east-2',
   });

   storageConfig = multerS3({
      acl: 'public-read',
      s3,
      bucket: 'pic-exchange-demo',
      key: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      },
   });
} else {
   storageConfig = multer.diskStorage({
      destination: function (req, file, cb) {
         cb(null, path.join('public', 'uploads'));
      },
      filename: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      },
   });
}

const fileExtFilter = (req, file, cb) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
   } else {
      cb(null, false);
   }
};

const maxFileSize = 10 * 1000 * 1000;
module.exports = multer({ storage: storageConfig, fileFilter: fileExtFilter, limits: { fileSize: maxFileSize } });
