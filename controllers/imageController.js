const Image = require('../models/Image');
const User = require('../models/User');

let ImageController = {
   upload: async (req, res) => {
      const user = await User.findOne({ username: req.body.uploader }).catch((err) => {
         return res.status(500).send(err.message);
      });

      const image = new Image({
         filename: req.file.filename,
         path: req.file.path,
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
         console.log(err);
         return res.status(500).send(err.message);
      }
   },
   index: async (req, res) => {
      // This definitely isn't the way to go at large scale, but good enough for now
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
            return res.status(200).download(image.path);
         } catch (err) {
            return res.status(500).send(err.message);
         }
      } else {
         return res.status(403).send({ err: 'Insufficient credits to download image' });
      }
   },
};
module.exports = ImageController;
