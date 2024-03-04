const express = require('express')
const router = express.Router()
const passport = require('passport')
const { client } = require('../config')
const User = require('../models/user')

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

router.get('/login/success', (req, res) => {
  if (req.user) {
    User.findOne({ googleid: req.user.id }).then((currentUser) => {
      if (currentUser) {
        // console.log(currentUser)
        res.status(200).json({
          success: true,
          message: 'successful',
          user: {
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            googleid: currentUser.googleid,
            color: currentUser.color,
            favorites: currentUser.favorites,
          },
        })
      } else {
        if (req.user.provider === 'google') {
          new User({
            name: req.user.displayName,
            email: req.user.email,
            googleid: req.user.id,
            color: '#781111',
          }).save((err, newUser) => {
            if (err) {
              const errors = handleErrors(err)
              res.json({ error: errors })
            } else {
              res.status(200).json({
                success: true,
                message: 'successful',
                user: {
                  _id: newUser._id,
                  name: newUser.name,
                  email: newUser.email,
                  googleid: newUser.googleid,
                  color: newUser.color,
                  favorites: newUser.favorites,
                },
              })
            }
          })
        } else if (req.user.provider === 'github') {
          console.log('github')
          new User({
            name: req.user.displayName
              ? req.user.displayName
              : req.user.username,
            email: req.user?.emails[0].value,
            googleid: req.user.id,
            color: '#781111',
          }).save((err, newUser) => {
            if (err) {
              const errors = handleErrors(err)
              res.json({ error: errors })
            } else {
              res.status(200).json({
                success: true,
                message: 'successful',
                user: {
                  _id: newUser._id,
                  name: newUser.name,
                  email: newUser.email,
                  googleid: newUser.googleid,
                  color: newUser.color,
                  favorites: newUser.favorites,
                },
              })
            }
          })
        }
      }
    })
  }
})

router.get('/login/failed', (req, res) => {
  // console.log('failed to login')
  res.status(401).json({
    success: false,
    message: 'failure',
  })
})

router.get('/logout', (req, res) => {
  // console.log('logged out')
  req.logout()
  res.cookie('session', '', { expires: new Date(0) })
  res.redirect(client)
})

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
