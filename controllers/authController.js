const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

let AuthController = {
   register: async (req, res) => {
      const userExists = await User.findOne({ username: req.body.username }).catch((err) => {
         return res.status(500).send(err);
      });
      if (userExists) {
         return res.status(501).send('A user with this username already exists');
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10).catch((err) => {
         return res.status(500).send(err);
      });

      const user = new User({
         username: req.body.username,
         password: hashedPassword,
         downloadCredits: 5,
      });

      try {
         await user.save();
         return res.status(201).send('User succesfully created');
      } catch (err) {
         return res.status(500).send(err);
      }
   },
   login: async (req, res, next) => {
      passport.authenticate('local', function (err, user, info) {
         if (err) {
            return res.status(400).json({ errors: err });
         }
         if (!user) {
            return res.status(400).json({ errors: err });
         }

         req.logIn(user, function (err) {
            if (err) {
               return res.status(400).json({ errors: err });
            }
            return res.status(200).send(user.clientUserData);
         });
      })(req, res, next);
   },
   logout: async (req, res) => {
      req.logout();
      res.redirect('/');
   },
   currentUser: async (req, res) => {
      res.send(req.user);
   },
};

module.exports = AuthController;
