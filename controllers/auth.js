const axios = require('axios')
const { bible_api } = require('../config')

console.log(bible_api, process.env.BIBLE_API)

axios.defaults.baseURL = bible_api

exports.allBooks = async (req, res) => {
  const { data } = await axios.get('/books')
  // res.json(data)
  res.json({ data, settings: req.appconfig })
  // console.log('successfully sent and retrieved')
}

exports.bookWithAllChapters = async (req, res) => {
  const { bookid } = req.body
  console.log(bookid)
  const { data } = await axios.get(`/books/${bookid}/chapters`)
  res.json(data)
  console.log('successfully sent and retrieved')
}

exports.bookChapterWithVerses = async (req, res) => {
  const { bookid, chapterid } = req.body
  // console.log(id)
  const { data } = await axios.get(`/books/${bookid}/chapters/${chapterid}`)
  res.json(data)
  // console.log('successfully sent and retrieved')
}

exports.bookChapterWithVersesAndTranslations = async (req, res) => {
  const { bookid, chapterid, abbreviation } = req.body
  console.log(bookid, chapterid, abbreviation)
  const { data } = await axios.get(
    `/books/${bookid}/chapters/${chapterid}?translation=${abbreviation}`
  )
  res.json(data)
  // console.log('successfully sent and retrieved')
}
exports.allTranslations = async (req, res) => {
  const { data } = await axios.get(`/translations`)
  res.json(data)
  // console.log('successfully sent and retrieved')
}

// we will need
// all the allBooks
// books and all their allChapters
// book, all chapters, allverses
