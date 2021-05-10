const User = require('../models/User');
const bcrypt = require('bcrypt');

let UserController = {
   register: async (req, res) => {
      const userExists = await User.findOne({ username: req.body.username }).catch((err) => {
         return res.status(500).send(err);
      });
      if (userExists) {
         return res.status(501).send({ err: 'A user with this username already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10).catch((err) => {
         return res.status(500).send({ msg: 'Error creating user', err });
      });

      const user = new User({
         username: req.body.username,
         password: hashedPassword,
         downloadCredits: 5,
      });

      try {
         await user.save();
         return res.status(201).send({ msg: 'User succesfully created' });
      } catch (err) {
         return res.status(500).send({ msg: 'Error creating user', err });
      }
   },
   getUser: async (req, res) => {
      const user = await User.findById(req.params.user_id)
         .then(() => {
            return res.send(user.clientUserData);
         })
         .catch((err) => {
            return res.status(500).send({ msg: 'Error fetching user', err });
         });
   },
   delete: async (req, res) => {
      await User.findByIdAndDelete(req.params.user_id)
         .then(() => {
            return res.status(200).send({ msg: 'User successfully deleted' });
         })
         .catch((err) => {
            return res.status(500).send({ msg: 'Error deleting user', err });
         });
   },
   update: async (req, res) => {
      await User.findByIdAndUpdate(req.params.user_id, { $set: { role: req.body.role } }, { runValidators: true })
         .then(() => {
            return res.status(200).send({ msg: 'User successfully updated' });
         })
         .catch((err) => {
            return res.status(500).send({ msg: 'Error updating user', err });
         });
   },
};

module.exports = UserController;
