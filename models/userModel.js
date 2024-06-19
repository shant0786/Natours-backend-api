const mongoose = require('mongoose');
const validator = require('validator');

// name , email, photo ,password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    require: [true, 'Please provide a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please provide a confirm password']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
