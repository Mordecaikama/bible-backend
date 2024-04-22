const express = require('express')
const router = express.Router()
const passport = require('passport')
const { client } = require('../config')
const { loginSuccess, loginFailed, logout } = require('../controllers/settings')
const { readConfigFileMidleware } = require('../middleware/settings')

const handleErrors = (err) => {
  let error = {
    email: '',
  }

  if (err.code === 11000) {
    error.email = 'this email is taken'
    return error
  }

  return error
}

router.get('/login/success', readConfigFileMidleware, loginSuccess)

router.get('/login/failed', loginFailed)

router.get('/logout', logout)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: client,
    failureRedirect: '/login/failed',
  })
)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: client,
    failureRedirect: '/login/failed',
  })
)
// router.get(
//   '/facebook',
//   passport.authenticate('facebook', { scope: ['email', 'profile'] })
// )

// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: client,
//     failureRedirect: '/login/failed',
//   })
// )

// router.post('/update-user', updateUser)

module.exports = router
