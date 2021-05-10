const router = require('express').Router();

const requireLogin = require('../services/requireLogin');
const upload = require('../services/multer');
const ImageController = require('../controllers/imageController');

/**
 * Image controller handles all the logic for the image-related routes
 *
 * POST /images/upload         - upload an image, store info about image in Image model
 *                               and a ref to it in user model (free for image owner)
 * GET /images/                - get all images for "browse" screen
 * GET /images/:id/download    - download the specified image
 * PATCH /images/:id           - update the description of the specified image (only doable by image owner)
 * DEL /images/:id             - delete the specified image (only doable by image owner)
 * GET /images/user/:user_id   - get all the images uploaded by the specified user
 *
 */
router.post('/upload', requireLogin, upload.single('image'), ImageController.upload);
router.get('/', ImageController.index);
router.get('/:id/download', requireLogin, ImageController.download);
router.patch('/:id', requireLogin, ImageController.update);
router.delete('/:id', requireLogin, ImageController.delete);
router.get('/user/:user_id', ImageController.getUserImages);

module.exports = router;
