import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        pages: Number,
        price: Number,
        publisher: String,
        isHandback: Boolean,
        isPaperback: Boolean
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            }
        }
    }
)

BookSchema.set('timestamps', true)

const BookModel = mongoose.model('books', BookSchema)

export default BookModel