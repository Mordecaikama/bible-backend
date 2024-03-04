const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your username'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      // required: [true, 'Please enter your password'],
      minlength: [6, 'Minimum password Length is 6'],
    },
    googleid: String,
    favorites: [],
    color: String,
    code: '',
    acc_setup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  // return users

  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth && user.acc_setup) {
      return user
    }

    if (!auth) {
      throw Error('incorrect password')
    }
    if (!user.acc_setup) {
      throw Error('Account not Verified')
    }
  }
  throw Error('incorrect email')
}

const User = mongoose.model('User', userSchema)

module.exports = User
