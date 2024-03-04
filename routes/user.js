const express = require('express')

const router = express.Router()

const {
  create_User,
  verifyEmail,
  get_User,
  Profile,
  forgotPassword,
  resetPassword,
  verifyCode,
  confirmEmail,
  updateUser,
  checkOldpassword,
} = require('../controllers/user')

router.post('/signup', create_User, verifyEmail)

router.post('/login', get_User)

router.post('/profile', Profile)

router.post('/forgotpassword', forgotPassword)

router.post('/verifycode', verifyCode)

router.post('/confirmemail', confirmEmail)

router.post('/resetpassword', resetPassword)

router.post('/update', updateUser)

router.post('/changepassword', checkOldpassword)

module.exports = router
