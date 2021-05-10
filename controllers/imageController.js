const url = require('url');
const aws = require('aws-sdk');
const path = require('path');

const Image = require('../models/Image');
const User = require('../models/User');
const keys = require('../config/keys');

let ImageController = {
   upload: async (req, res) => {
      const user = await User.findOne({ username: req.body.uploader }).catch((err) => {
         return res.status(500).send({ msg: 'Error finding user', err });
      });

      // Filename and path have 2 values due to making AWS files and locally stored work
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
         return res.status(201).send({ msg: 'Image uploaded successfully' });
      } catch (err) {
         return res.status(500).send({ msg: 'Error uploading images', err });
      }
   },
   index: async (req, res) => {
      const allImages = await Image.find()
         .populate({ path: 'uploader', select: 'username -_id' })
         .catch((err) => {
            return res.status(500).send({ msg: 'Error getting images', err });
         });
      return res.status(200).send(allImages);
   },
   download: async (req, res) => {
      const user = await User.findOne({ username: req.user.username }).catch((err) => {
         return res.status(500).send({ msg: 'Error finding user', err });
      });

      const image = await Image.findOne({ _id: req.params.id }).catch((err) => {
         return res.status(500).send({ msg: 'Error finding image', err });
      });

      if (isOwner(image.uploader, user._id) || user.downloadCredits >= 1) {
         try {
            image.downloads += 1;
            await image.save();

            if (!isOwner(image.uploader, user._id)) {
               user.downloadCredits -= 1;
               await user.save();
            }

            // AWS specific code to download an image through createReadStream, sends as blob
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
                  .on('error', (err) => {
                     res.send({ msg: 'AWS error', err });
                  });
               return file.pipe(res);
            }

            // Locally stored specific code to download an image, sends as a blob
            return res.status(200).download(path.join('public', 'uploads', image.filename));
         } catch (err) {
            return res.status(500).send({ err: 'Error downloading image', err });
         }
      } else {
         return res.status(403).send({ msg: 'Insufficient credits to download image' });
      }
   },
   update: async (req, res) => {
      const image = await Image.findById(req.params.id).catch((err) => {
         return res.status(500).send({ msg: "Couldn't find image", err });
      });
      if (!isOwner(image.uploader, req.user._id)) return res.status(401).send({ msg: 'Unauthorized', err });
      await image.updateOne({ $set: { description: req.body.description } }).catch((err) => {
         return res.status(500).send({ msg: "Couldn't find image", err });
      });
      return res.status(200).send({ msg: 'Image updated successfully' });
   },
   delete: async (req, res) => {
      const image = await Image.findById(req.params.id).catch((err) => {
         return res.status(500).send({ msg: "Couldn't find image", err });
      });

      if (!isOwner(image.uploader, req.user._id)) return res.status(401).send({ msg: 'Unauthorized', err });

      const user = await User.findOne({ _id: req.user._id }).catch((err) => {
         return res.status(500).send({ msg: "Couldn't find user", err });
      });

      try {
         // Remove the reference to the image from the User's list of images
         user.images.remove(image._id);
         await user.save();

         await image.deleteOne().catch((err) => {
            return res.status(500).send({ msg: 'Error deleting image', err });
         });
         return res.status(200).send({ msg: 'Successfully deleted image' });
      } catch (err) {
         return res.status(500).send({ msg: 'Error removing image from user list', err });
      }
   },
   getUserImages: async (req, res) => {
      const userImages = await Image.find({ uploader: req.params.user_id })
         .populate({ path: 'uploader', select: 'username -_id' })
         .catch((err) => {
            return res.status(500).send({ msg: "Error getting user's images", err });
         });
      return res.status(200).send(userImages);
   },
};

function formatLocalPath(filename) {
   return `http://localhost:${keys.port}/${filename}`;
}

function isOwner(imageUploader, currentUser) {
   return imageUploader.toString() === currentUser.toString();
}

module.exports = ImageController;
