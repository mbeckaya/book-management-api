import dotenv from 'dotenv'
dotenv.config()
process.env.DATABASE = process.env.DATABASE_TEST
import request from 'supertest'
import app from '../app'
import Controller from '../controllers/Controller'
import BookModel from '../models/BookModel'

const bookData = {
    title: 'title',
    author: 'author',
    publisher: 'publisher',
    pages: 11,
    price: 9,
    isHandback: true,
    isPaperback: false
}

describe('Test endpoints', () => {
    beforeAll(async () => {
        await BookModel.deleteMany()
    })

    it('should return a list of all books', async () => {
        const book = new BookModel(bookData)
        await book.save()

        const response = await request(app).get('/api/v1/books')

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
        expect(response.body[0]).toHaveProperty('title')
        expect(response.body[0]).toHaveProperty('author')
        expect(response.body[0]).toHaveProperty('publisher')
        expect(response.body[0]).toHaveProperty('isHandback')
        expect(response.body[0]).toHaveProperty('isPaperback')
        expect(response.body[0]).toHaveProperty('price')
        expect(response.body[0]).toHaveProperty('pages')
    })

    it('should return a specific book', async () => {
        const book = new BookModel(bookData)
        const saveBook = await book.save()

        const response = await request(app).get(`/api/v1/books/${saveBook.id}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('publisher')
        expect(response.body).toHaveProperty('isHandback')
        expect(response.body).toHaveProperty('isPaperback')
        expect(response.body).toHaveProperty('price')
        expect(response.body).toHaveProperty('pages')
    })

    it('should create a new book', async () => {
        const response = await request(app).post('/api/v1/books').send(bookData)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('publisher')
        expect(response.body).toHaveProperty('isHandback')
        expect(response.body).toHaveProperty('isPaperback')
        expect(response.body).toHaveProperty('price')
        expect(response.body).toHaveProperty('pages')
    })

    it('should return validation errors on create a new book', async () => {
        const bookDataModified = Object.assign({}, bookData)
        bookDataModified.title = 'Lorem ipsum dolor sit amet, consetetur sadipscing e'
        bookDataModified.author = 'L'
        bookDataModified.publisher = 'Lorem ipsum dolor sit amet'
        // @ts-ignore
        bookDataModified.isHandback = 'boolean'
        // @ts-ignore
        bookDataModified.isPaperback = 'boolean'
        bookDataModified.price = 2000
        bookDataModified.pages = 25000

        const response = await request(app).post('/api/v1/books').send(bookDataModified)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors.length).toBe(7)
        expect(response.body.errors[0]).toHaveProperty('param')
        expect(response.body.errors[0].param).toBe('title')
        expect(response.body.errors[1]).toHaveProperty('param')
        expect(response.body.errors[1].param).toBe('author')
        expect(response.body.errors[2]).toHaveProperty('param')
        expect(response.body.errors[2].param).toBe('publisher')
        expect(response.body.errors[3]).toHaveProperty('param')
        expect(response.body.errors[3].param).toBe('isHandback')
        expect(response.body.errors[4]).toHaveProperty('param')
        expect(response.body.errors[4].param).toBe('isPaperback')
        expect(response.body.errors[5]).toHaveProperty('param')
        expect(response.body.errors[5].param).toBe('price')
        expect(response.body.errors[6]).toHaveProperty('param')
        expect(response.body.errors[6].param).toBe('pages')
    })

    it('should update a specific book', async () => {
        const book = new BookModel(bookData)
        const saveBook = await book.save()
        const bookDataUpdated = Object.assign({}, bookData)
        bookDataUpdated.title = 'title NEW'

        const response = await request(app).put(`/api/v1/books/${saveBook.id}`).send(bookDataUpdated)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('title')
        expect(response.body.title).toBe(bookDataUpdated.title)
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('publisher')
        expect(response.body).toHaveProperty('isHandback')
        expect(response.body).toHaveProperty('isPaperback')
        expect(response.body).toHaveProperty('price')
        expect(response.body).toHaveProperty('pages')
    })

    it('should delete a specific book ', async () => {
        const book = new BookModel({ title: 'title' })
        const saveBook = await book.save()

        const response = await request(app).delete(`/api/v1/books/${saveBook.id}`)

        expect(response.status).toBe(204)
    })

    it('should return a list with selected fields', async () => {
        await BookModel.deleteMany()

        let books = []
        for (let i = 0; i < 10; i++) {
            books.push(bookData)
        }
        await BookModel.insertMany(books)

        const response = await request(app).get('/api/v1/books?fields=title,author')

        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty('title')
        expect(response.body[0]).toHaveProperty('author')
        expect(response.body[0].publisher).toBe(undefined)
        expect(response.body[0].pages).toBe(undefined)
        expect(response.body[0].price).toBe(undefined)
        expect(response.body[0].isHandback).toBe(undefined)
        expect(response.body[0].isPaperback).toBe(undefined)
    })

    it('should return a list with limited results', async () => {
        await BookModel.deleteMany()

        let books = []
        for (let i = 0; i < 10; i++) {
            books.push({ title: `title ${i + 1}` })
        }
        await BookModel.insertMany(books)

        const response = await request(app).get('/api/v1/books?size=5')

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(5)
    })

    it('should return a list with pagination', async () => {
        await BookModel.deleteMany()

        let books = []
        for (let i = 0; i < 20; i++) {
            books.push({ title: `title ${i + 1}` })
        }
        await BookModel.insertMany(books)

        const response = await request(app).get('/api/v1/books?page=2&size=10')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('totalPages')
        expect(response.body).toHaveProperty('currentPage')
        expect(response.body).toHaveProperty('previousPage')
        expect(response.body).toHaveProperty('nextPage')
        expect(response.body).toHaveProperty('data')
    })

    it('should return a list sorted by title in ascending order', async () => {
        await BookModel.deleteMany()

        const bookDataA = Object.assign({}, bookData)
        bookDataA.title = 'A title'
        const bookDataB = Object.assign({}, bookData)
        bookDataB.title = 'B title'
        let bookA = new BookModel(bookDataA)
        await bookA.save()
        const bookB = new BookModel(bookDataB)
        await bookB.save()

        const response = await request(app).get('/api/v1/books?sort_by=title&order_by=asc')

        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty('title')
        expect(response.body[0].title).toBe(bookA.title)
        expect(response.body[1]).toHaveProperty('title')
        expect(response.body[1].title).toBe(bookB.title)
    })

    it('should return a list sorted by title in descend order', async () => {
        await BookModel.deleteMany()

        const bookDataA = Object.assign({}, bookData)
        bookDataA.title = 'A title'
        const bookDataB = Object.assign({}, bookData)
        bookDataB.title = 'B title'
        let bookA = new BookModel(bookDataA)
        await bookA.save()
        const bookB = new BookModel(bookDataB)
        await bookB.save()

        const response = await request(app).get('/api/v1/books?sort_by=title&order_by=desc')

        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty('title')
        expect(response.body[0].title).toBe(bookB.title)
        expect(response.body[1]).toHaveProperty('title')
        expect(response.body[1].title).toBe(bookA.title)
    })
})
