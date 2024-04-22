const fs = require('fs')
const User = require('../models/user')
const { client } = require('../config')

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

exports.writefile = (req, res) => {
  const data = JSON.stringify(req.body, null, 2)

  fs.writeFile('settings.json', data, (err, data) => {
    if (err) {
      res.json({ err })
    }
    res.json({ data })
  })
}

//checks Favorite
exports.checkFavorite = (req, res, next) => {
  const data = req.body
  User.findOneAndUpdate(
    { _id: data.userId, 'favorites.id': { $eq: data?.data?.id } },
    {
      $set: {
        'favorites.$.color': data?.data?.color,
        'favorites.$.notes': data?.data?.notes,
      },
    },
    {
      new: true,
      select: { name: 1, email: 1, favorites: 1, config: 1, notes: 1 },
    },
    (error, data) => {
      if (error || !data) {
        req.body.favorite = false
        next()
      } else {
        res.json({ data })
      }
    }
  )
}

// adds favorite
exports.addFavorite = (req, res) => {
  const data = req.body
  // res.json({ data: data })

  if (!data.favorite) {
    User.findOneAndUpdate(
      { _id: data?.userId },
      { $push: { favorites: data?.data } },
      {
        new: true,
        select: { name: 1, email: 1, favorites: 1, notes: 1, config: 1 },
      },
      (error, data) => {
        if (error || !data) {
          return false
        }

        res.json({ data })
      }
    )
  }
}

exports.loginSuccess = (req, res) => {
  if (req.user) {
    User.findOne({ googleid: req.user.id }).then((currentUser) => {
      if (currentUser) {
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
            config: currentUser.config,
          },
        })
      } else {
        if (req.user.provider === 'google') {
          new User({
            name: req.user.displayName,
            email: req.user.email,
            googleid: req.user.id,
            color: '#781111',
            config: req.default,
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
                  config: newUser.config,
                },
              })
            }
          })
        } else if (req.user.provider === 'github') {
          new User({
            name: req.user.displayName
              ? req.user.displayName
              : req.user.username,
            email: req.user.emails[0].value,
            googleid: req.user.id,
            color: '#781111',
            config: req.default,
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
                  config: newUser.config,
                },
              })
            }
          })
        }
      }
    })
  }
}
exports.loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  })
}

exports.logout = (req, res) => {
  req.logout()
  res.cookie('session', '', { expires: new Date(0) })
  res.redirect(client)
}
