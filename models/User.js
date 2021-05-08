const mongoose = require('mongoose');
const { Schema } = mongoose;

const ROLES = { ADMIN: 'admin', USER: 'user' };

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20,
   },
   password: {
      type: String,
      required: true,
      minLength: 4,
   },
   downloadCredits: {
      type: Number,
      required: true,
      min: 0,
   },
   role: {
      type: String,
      enum: { values: Object.values(ROLES), message: '{VALUE} is not supported' },
      default: 'user',
   },
   images: [{ type: Schema.Types.ObjectId, ref: 'images' }],
});

// Used to get info useful to client out of User schema
userSchema.virtual('clientUserData').get(function () {
   return { username: this.username, downloadCredits: this.downloadCredits };
});

module.exports = mongoose.model('users', userSchema);
