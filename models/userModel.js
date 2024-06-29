const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    require: [true, 'Please provide a confirm password'],
    validate: {
      // This only works on CREATE and SAVE !!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not same !'
    }
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function was atually modified
  if (!this.isModified('password')) return next();
  // Hash the password with const of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete PasswordConfirm field
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
