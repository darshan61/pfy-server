const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String, trim: true, required: true, unique: true, immutable: true,
  },
  firstName: String,
  lastName: String,
  email: { type: String, trim: true },
  password: { type: String, required: true },
  profileImage: String,
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

userSchema.pre('save', async function preSave(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.isValidPassword = async function isValidPassword(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
