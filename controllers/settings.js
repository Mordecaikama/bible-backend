const fs = require('fs')
const User = require('../models/user')

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
  console.log(data)
  User.findOneAndUpdate(
    { _id: data.userId, 'favorites.id': { $eq: data?.data?.id } },
    {
      $set: {
        'favorites.$.color': data?.data?.color,
        'favorites.$.notes': data?.data?.notes,
      },
    },
    { new: true, select: { name: 1, favorites: 1, color: 1, notes: 1 } },
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
  console.log(data)

  if (!data.favorite) {
    console.log('no data ', data?.data)
    User.findOneAndUpdate(
      { _id: data?.userId },
      { $push: { favorites: data?.data } },
      { new: true, select: { name: 1, favorites: 1, color: 1, notes: 1 } },
      (error, data) => {
        if (error || !data) {
          console.log(error, 'error here')
        }

        res.json({ data })
      }
    )
  }
}
