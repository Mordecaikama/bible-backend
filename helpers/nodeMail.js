const nodemailer = require('nodemailer')
const { Nodemailer_email, Nodemailer_pass } = require('../config')

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   service: 'gmail',
//   auth: {
//     user: Nodemailer_email,
//     pass: Nodemailer_pass,
//   },
// })
const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.eu',
  secure: true,
  port: 465,
  auth: {
    user: Nodemailer_email,
    pass: Nodemailer_pass,
  },
})

// then add
// template key with value to the file path to the options

// const options = {
//   from: 'agyapongmordecai@gmail.com',
//   to: 'mezleme3@gmail.com',
//   subject: 'sending email from sendmail',
//   text: 'trying for the firstime using nodejs to send from backend to you man',
// }

module.exports = {
  transporter,
}
