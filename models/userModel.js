const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name , email, photo ,password, passwordConfirm

const userSchema = new mongoose.Schema({
  passwordChangedAt: Date,
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
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please provide a confirm password'],
    validate: {
      // This only works on CREATE and SAVE !!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not same !'
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

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False mean not changed
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
