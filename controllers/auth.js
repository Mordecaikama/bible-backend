const axios = require('axios')
const { bible_api } = require('../config')

axios.defaults.baseURL = bible_api

exports.allBooks = async (req, res) => {
  const { data } = await axios.get('/books')
  // res.json(data)
  res.json({ data, settings: req.appconfig })
}

exports.bookWithAllChapters = async (req, res) => {
  const { bookid } = req.body
  const { data } = await axios.get(`/books/${bookid}/chapters`)
  res.json(data)
}

exports.bookChapterWithVerses = async (req, res) => {
  const { bookid, chapterid } = req.body
  const { data } = await axios.get(`/books/${bookid}/chapters/${chapterid}`)
  res.json(data)
}

exports.bookChapterWithVersesAndTranslations = async (req, res) => {
  const { bookid, chapterid, abbreviation } = req.body
  const { data } = await axios.get(
    `/books/${bookid}/chapters/${chapterid}?translation=${abbreviation}`
  )
  res.json(data)
}
exports.allTranslations = async (req, res) => {
  const { data } = await axios.get(`/translations`)
  res.json(data)
}

// we will need
// all the allBooks
// books and all their allChapters
// book, all chapters, allverses
