const express = require('express')

// user login information
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

//settings
const passport = require('passport')
const { client } = require('../config')

const router = express.Router()

const { loginSuccess, loginFailed, logout } = require('../controllers/settings')

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

const {
  allBooks,
  bookChapterWithVerses,
  bookWithAllChapters,
  allTranslations,
  bookChapterWithVersesAndTranslations,
} = require('../controllers/auth')

const { readConfigfilemiddleware } = require('../middleware/settings')
const { checkFavorite, addFavorite } = require('../controllers/settings')

router.post('/favorites', checkFavorite, addFavorite)
router.get('/all-books', readConfigfilemiddleware, allBooks)
router.get('/all-translations', allTranslations)
router.post('/all-chapters', bookChapterWithVerses)
router.post('/book-all-chapters', bookWithAllChapters)
router.post(
  '/book-all-chapters-translations',
  bookChapterWithVersesAndTranslations
)

// /settings with passport js

router.get('/auth/login/success', loginSuccess)

router.get('/login/failed', loginFailed)

router.get('/auth/logout', logout)

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: client,
    failureRedirect: '/login/failed',
  })
)

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: client,
    failureRedirect: '/login/failed',
  })
)

// user login information

router.post('/signup', create_User, verifyEmail)

router.post('/login', get_User)

router.post('/profile', Profile)

router.post('/forgotpassword', forgotPassword)

router.post('/verifycode', verifyCode)

router.post('/confirmemail', confirmEmail)

router.post('/resetpassword', resetPassword)

router.post('/update', updateUser)

router.post('/changepassword', checkOldpassword)

router.get('/testsite', (req, res) => {
  res.send({
    data: true,
    message: 'Successful',
    data: 'more to come',
  })
})

module.exports = router
