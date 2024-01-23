const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const axios = require('axios')

const path = require('path')

const authRoutes = require('./routes/auth')

const morgan = require('morgan')

const app = express()

// middlewares
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }))

app.use(morgan('dev'))
// route middlewares
app.use('/api', authRoutes)

app.use((err, req, res, next) => {
  // console.log(err)
  res.status(err.status).json(err)
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log('Server running on port 8000'))
