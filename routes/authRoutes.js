const router = require('express').Router();

const AuthController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/current_user', AuthController.currentUser);

module.exports = router;
