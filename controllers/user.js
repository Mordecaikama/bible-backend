const User = require('../models/user')
const bcrypt = require('bcrypt')
var { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken')
const { cookieKey, Nodemailer_email } = require('../config')
const { transporter } = require('../helpers/nodeMail')
const ejs = require('ejs')
const path = require('path')

const handleErrors = (err) => {
  let error = {
    name: '',
    email: '',
    password: '',
    acc: '',
    state: '',
  }

  // incorrect email
  if (err.message === 'incorrect email') {
    error.email = 'Email is not registered'
    return error
  }
  if (err.message === 'Account not Verified') {
    error.state = 'Account Needs verification'
  }
  if (err.message === 'incorrect password') {
    error.password = 'incorrect password'
    return error
  }

  if (err.code === 11000) {
    error.email = 'this email is taken'
    return error
  }

  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message
    })
  }
  return error
}

const maxAge = 60 * 4320
const createToken = (id) => {
  return jwt.sign({ id }, cookieKey, {
    expiresIn: '2h',
  })
}

exports.create_User = async (req, res, next) => {
  const salt = await bcrypt.genSalt()
  req.body.password = await bcrypt.hash(req.body.password, salt)

  const user = new User(req.body)
  user.save((err, data) => {
    if (err) {
      const errors = handleErrors(err)
      res.json({ error: errors })
    } else {
      next()
    }
  })
}

exports.get_User = async (req, res) => {
  // a user logsin to an organisational portal
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: maxAge * 1000,
      // sameSite: 'None',
    })

    res.status(200).json({
      success: true,
      message: 'successfull',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        color: user.color,
        favorites: user.favorites,
      },
    })
  } catch (error) {
    const errors = handleErrors(error)
    res.send({ errors })
  }
}

exports.Profile = (req, res) => {
  const token = req.cookies.session

  if (token) {
    jwt.verify(token, cookieKey, async (err, decodedToken) => {
      if (err) {
      } else {
        let user = await User.findById(decodedToken.id).select(
          '-password -acc_setup '
        )
        res.status(200).json({
          success: true,
          message: 'successfull',
          user,
        })
      }
    })
  }
}

exports.updateUser = async (req, res) => {
  const user = req.body
  // res.json({ bd: req.body, am: req.profile._id })

  // update user information

  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'user profile could not be updated',
        })
      }
      // res.json(doc)

      res.status(200).json({
        success: true,
        message: 'successfull',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          googleid: user?.googleid ? user?.googleid : null,
          color: user.color,
          favorites: user.favorites,
        },
      })
    }
  )
}

exports.checkOldpassword = async (req, res) => {
  // const user = req.profile
  // hash user password and compare with db password
  // const { password, newpass } = req.body
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.newpass, salt)

  try {
    const user = await User.login(req.body.email, req.body.password)

    if (user) {
      req.body.password = hashedPassword // changes old to new
      User.findOneAndUpdate(
        { _id: req.body.id },
        { $set: req.body },
        { new: true },
        (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'user could not be updated',
            })
          }

          res.status(200).json({
            success: true,
            message: 'successfull',
          })
        }
      )
    }
  } catch (error) {
    const errors = handleErrors(error)
    res.send({ errors })
  }

  // throw Error('incorrect email')
}

exports.forgotPassword = async (req, res) => {
  //email is reset after 5mins or 300,000
  const { email } = req.body

  // generate code
  const resetCode = nanoid(5).toUpperCase()

  User.findOneAndUpdate(
    { email: email },
    { $set: { code: resetCode } },
    { new: true },
    async (err, user) => {
      if (err || !user) {
        return res.json({ errors: 'User does not exist' })
      }

      if (user) {
        const data = await ejs.renderFile('./views/email.ejs', {
          username: user.name,
          code: resetCode,
        })

        const emailData = {
          from: Nodemailer_email,
          to: user.email,
          subject: 'Password reset code',
          html: data,
          // <span style="color:red"> ${resetCode}</span>
        }
        // send email
        transporter.sendMail(emailData, (err, data) => {
          if (err) {
            res.json({
              errors: false,
            })
          } else {
            res.json({
              msg: true,
            })
          }
        })

        const timers = setTimeout(
          () =>
            User.findOne({ email: email }).then((us) => {
              if (!us?.accsetup) {
                User.findOneAndUpdate(
                  { email: email },
                  { $set: { code: '' } },
                  { new: true },
                  (data) => {
                    // noting
                  }
                )
              }
            }),

          300000
        )
      }
      return () => clearTimeout(timers)
    }
  )
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body
    // find user based on email and resetCode
    const user = await User.findOne({
      email: email,
    })

    // if user not found
    if (!user) {
      res.json({ error: 'User does not exist' })
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long or more',
      })
    } else {
      // hash password

      const salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(password, salt)
      user.code = ''

      await user.save()
      res.json({ ok: true })
    }
  } catch (err) {
    return false
  }
}

// verifies pin to be true after code is entered
exports.verifyCode = async (req, res) => {
  const { code } = req.body

  const user = await User.findOne({ code: req.body.code.toUpperCase() })

  // if user not found
  if (!user) {
    res.json({ error: 'Reset code is invalid' })
  } else {
    user.code = ''
    await user.save()
    res.json({ ok: true })
  }
}

// confirms to be true after code is entered
exports.confirmEmail = async (req, res) => {
  const { code } = req.body

  const user = await User.findOne({ code: req.body.code.toUpperCase() })

  // if user not found
  if (!user) {
    res.json({ error: 'Email or reset code is invalid' })
  } else {
    user.code = ''
    user.acc_setup = true
    await user.save()
    res.json({ ok: true })
  }
}

exports.verifyEmail = async (req, res) => {
  //email is reset after 5mins or 300,000
  const { email } = req.body

  // generate code
  const resetCode = nanoid(5).toUpperCase()

  User.findOneAndUpdate(
    { email: email },
    { $set: { code: resetCode } },
    { new: true },
    async (err, user) => {
      if (err || !user) {
        return res.json({ errors: 'User does not exist' })
      }

      if (user) {
        const data = await ejs.renderFile('./views/confirm.ejs', {
          username: user.name,
          code: resetCode,
        })

        const emailData = {
          from: Nodemailer_email,
          to: user.email,
          subject: 'Verify Your Email',
          html: data,
          // <span style="color:red"> ${resetCode}</span>
        }
        // send email
        transporter.sendMail(emailData, (err, data) => {
          if (err) {
            res.json({
              error: false,
            })
          } else {
            res.json({ data: true })
          }
        })

        const timers = setTimeout(
          () =>
            User.findOne({ email: email }).then((us) => {
              if (!us?.accsetup) {
                User.findOneAndUpdate(
                  { email: email },
                  { $set: { code: '' } },
                  { new: true },
                  (data) => {
                    // noting
                  }
                )
              }
            }),

          300000
        )
      }
      return () => clearTimeout(timers)
    }
  )
}
