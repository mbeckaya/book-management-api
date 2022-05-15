import express from 'express'
import { body, validationResult } from 'express-validator'
import Controller from './Controller'
import BookModel from '../models/BookModel'

export default class BookController extends Controller {
    public static validationRules = [
        body('title')
            .isString()
            .isLength({ min: 5, max: 50 })
            .withMessage('must have between 5 and 50 characters'),
        body('author')
            .isString()
            .isLength({ min: 2, max: 25 })
            .withMessage('must have between 2 and 25 characters'),
        body('publisher')
            .isString()
            .isLength({ min: 2, max: 25 })
            .withMessage('must have between 2 and 25 characters'),
        body('isHandback').isBoolean(),
        body('isPaperback').isBoolean(),
        body('price')
            .optional()
            .isFloat({ min: 0.99, max: 300.00 })
            .withMessage('must have between 0.99 and 300.00 numbers'),
        body('pages')
            .optional()
            .isFloat({ min: 1, max: 2000 })
            .withMessage('must have between 1 and 2000 numbers'),
    ]

    public static async index(req: express.Request, res: express.Response) {
        try {
            const select: string[] = BookController.getQueryFields(req)
            const isSortParams: boolean = Boolean(req.query.sort_by && req.query.order_by)
            const isPageParam: boolean = Boolean(req.query.page)
            const isSizeParam: boolean = Boolean(req.query.size)
            const totalBooks: number = await BookModel.count()
            let sort: object = {}
            let skip: number = 0
            let limit: number = totalBooks
            let paginationMeta: object = {}

            if (isSortParams) {
                const sortBy: string = req.query.sort_by as string
                const orders: object = {
                    asc: 1,
                    desc: -1
                }
                const orderBy: string = req.query.order_by as string
                sort = {
                    [sortBy]: orders[orderBy]
                }
            }

            if (isSizeParam) {
                limit = parseInt(req.query.size as string, 10)
            }

            if (isPageParam) {
                const page: number = parseInt(req.query.page as string, 10)
                skip = (page > 1 ? (page - 1) * limit : 0)
                let totalPages: number = Math.ceil(totalBooks / limit)
                let currentPage: number = page
                let previousPage: number = (page > 1 ? (page - 1): 0)
                let nextPage: number = (page < totalPages ? (page + 1): 0)

                paginationMeta = {
                    totalPages,
                    currentPage,
                    previousPage,
                    nextPage
                }
            }

            let books: any = await BookModel
                .find({})
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(select)

            if (isPageParam) {
                books = Object.assign({}, paginationMeta, { data: books })
            }

            return res.status(200).json(books)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    public static async show(req: express.Request, res: express.Response) {
        try {
            const select: string[] = BookController.getQueryFields(req)
            const book = await BookModel.findOne({ _id: req.params.id }).select(select)
            return res.status(200).json(book)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    public static async store(req: express.Request, res: express.Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const newBook = new BookModel(req.body)
            const saveBook = await newBook.save()
            res.status(201).json(saveBook)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const updatedBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.status(200).json(updatedBook)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    public static async destroy(req: express.Request, res: express.Response) {
        try {
            await BookModel.findByIdAndRemove(req.params.id)
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}