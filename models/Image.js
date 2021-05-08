const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileExtValidator = {
   validator: (value) => {
      return /[a-zA-Z0-9\s_\\.\-\(\):]+(.jpg|.png|.jpeg)$/.test(value);
   },
   message: (props) => `${props.value} does not have a valid file format (jpg, jpeg, png)`,
};

const imageSchema = new Schema({
   filename: {
      type: String,
      required: true,
      validate: fileExtValidator,
   },
   path: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 80,
   },
   uploader: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
   },
   downloads: {
      type: Number,
      default: 0,
   },
});

module.exports = mongoose.model('images', imageSchema);
