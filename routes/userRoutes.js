const router = require('express').Router();

const UserController = require('../controllers/userController');

/**
 * User controller handles all the logic for the user-related routes
 *
 * POST /register       - Register for a new account with this username + password
 * GET /:user_id        - Get user info of the specified user
 * DEL /:user_id        - Delete the specified user
 * PATCH /:user_id      - Upadte the role of the specified user
 *
 */
router.post('/register', UserController.register);
router.get('/:user_id', UserController.getUser);
router.delete('/:user_id', UserController.delete);
router.patch('/:user_id', UserController.update);

module.exports = router;
