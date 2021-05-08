const router = require('express').Router();

const requireLogin = require('../services/requireLogin');
const upload = require('../services/multer');
const ImageController = require('../controllers/imageController');

router.post('/upload', requireLogin, upload.single('image'), ImageController.upload);
router.get('/', ImageController.index);
router.get('/:id/download', requireLogin, ImageController.download);

module.exports = router;
