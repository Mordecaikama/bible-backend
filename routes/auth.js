const express = require('express')

const router = express.Router()

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

// router.param('bookId', bookById)
// router.param('chapterId', chapterById)

module.exports = router
