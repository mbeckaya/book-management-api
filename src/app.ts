import dotenv from 'dotenv'
dotenv.config()
import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import clc from 'cli-color'
import BookRouter from './routes/BookRouter'
const HOST: string = process.env.HOST || '127.0.0.1'
const PORT: string|number = process.env.PORT || 8000
const DATABASE: string = process.env.DATABASE || 'mongodb://localhost:27017/book-management-api'
const app: Express = express()

app.use(cors())
app.use(express.json())
app.use('/', BookRouter)

app.use((req: express.Request, res: express.Response) => {
    return res.status(404).json({ message: 'Not found' })
})

app.listen(PORT, () => {
    console.log(clc.blue(`Server: ${HOST}:${PORT}`))

    mongoose
        .connect(DATABASE)
        .then(() => {
            console.log(clc.blue(`Database: ${DATABASE}`))
        })
        .catch(err => {
            console.log(clc.red(`Cannot connect database: ${DATABASE}`), err)
            process.exit()
        })
})

export default app