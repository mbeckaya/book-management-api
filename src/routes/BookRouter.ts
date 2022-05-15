import express from 'express'
import BookController from '../controllers/BookController'
const router = express.Router()

router.get('/api/v1/books', BookController.index)
router.get('/api/v1/books/:id', BookController.show)
router.post('/api/v1/books', BookController.validationRules, BookController.store)
router.put('/api/v1/books/:id', BookController.validationRules, BookController.update)
router.delete('/api/v1/books/:id', BookController.destroy)

export default router