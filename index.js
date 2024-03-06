const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { db, cookieKey } = require('./config')
const cookieSession = require('cookie-session')
const PassportSetup = require('./middleware/passport-setup')
const passport = require('passport')

const path = require('path')

const authRoutes = require('./routes/auth')
// const authSettings = require('./routes/settings')
// const authUsers = require('./routes/user')

const morgan = require('morgan')

const app = express()

mongoose.set('strictQuery', false)
mongoose
  .connect(db || null) // db is online resource, referenced at the top
  .then((results) => false)
  .catch((e) => {
    res.json({ error: e })
  })

// middlewares
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  })
)

// initialze passport
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))

app.use(morgan('dev'))
// route middlewares
app.use('/api', authRoutes)
// app.use('/api', authUsers)
// app.use('/api/auth', authSettings)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status)
})

const port = process.env.PORT || 8000

app.listen(port, () => false)
