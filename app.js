import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/mongodb_connection.js'
import { studentRouter } from './routes/student.routes.js'
import { logging } from './middleware/logging.middleware.js'

dotenv.config()
const app = express()
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(logging)

app.use("/students", studentRouter)


connectDB().then(() => {
    app.listen(process.env.PORT, (error) => {
        if (error) {
            console.log('Error starting server', error)
        }
        console.log('Server started at port: ', process.env.PORT)
    })
}).catch((error) => {
    console.log('Error connecting to MongoDB', error)
})