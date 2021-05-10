const passport = require('passport');

let AuthController = {
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
      req.logOut();
      res.redirect('/');
   },
   currentUser: async (req, res) => {
      res.send(req.user);
   },
};

module.exports = AuthController;
