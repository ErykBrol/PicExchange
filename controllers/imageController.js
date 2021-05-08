const url = require('url');
const aws = require('aws-sdk');

const Image = require('../models/Image');
const User = require('../models/User');
const keys = require('../config/keys');

let ImageController = {
   upload: async (req, res) => {
      const user = await User.findOne({ username: req.body.uploader }).catch((err) => {
         return res.status(500).send(err.message);
      });

      console.log(req.file.path);
      const image = new Image({
         filename: req.file.filename || req.file.key,
         path: req.file.filename ? formatLocalPath(req.file.filename) : req.file.location,
         uploader: user,
         description: req.body.description ? req.body.description : null,
      });

      try {
         await image.save();
         user.downloadCredits += 1;
         user.images.push(image);
         await user.save();
         return res.status(201).send('Image uploaded successfully');
      } catch (err) {
         return res.status(500).send(err.message);
      }
   },
   index: async (req, res) => {
      const allImages = await Image.find()
         .populate({ path: 'uploader', select: 'username -_id' })
         .catch((err) => {
            return res.status(500).send(err.message);
         });
      return res.status(200).send(allImages);
   },
   download: async (req, res) => {
      const user = await User.findOne({ username: req.query.username }).catch((err) => {
         return res.status(500).send(err);
      });
      if (user.downloadCredits >= 1) {
         const image = await Image.findOne({ _id: req.params.id }).catch((err) => {
            return res.status(500).send(err);
         });

         try {
            image.downloads += 1;
            await image.save();
            user.downloadCredits -= 1;
            await user.save();

            if (process.env.NODE_ENV === 'production') {
               const s3 = new aws.S3({
                  secretAccessKey: keys.s3AccessSecret,
                  accessKeyId: keys.s3AccessKey,
                  region: 'us-east-2',
               });
               res.attachment(image.filename);
               var file = s3
                  .getObject({
                     Bucket: 'pic-exchange-demo',
                     Key: image.filename,
                  })
                  .createReadStream()
                  .on('error', (error) => {
                     console.log(error);
                  });
               return file.pipe(res);
            }

            return res.status(200).download('public\\uploads\\' + image.filename);
         } catch (err) {
            return res.status(500).send(err.message);
         }
      } else {
         return res.status(403).send({ err: 'Insufficient credits to download image' });
      }
   },
};

function formatLocalPath(filename) {
   return `http://localhost:${keys.port}/${filename}`;
}

module.exports = ImageController;
