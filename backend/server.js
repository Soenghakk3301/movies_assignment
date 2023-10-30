import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

const port = 3000

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// Import movie routes
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoutes.js'

// middleware
import notFoundMiddleware from './middlewares/not-found.js'
import errorHandlerMiddleware from './middlewares/error-handler.js'

app.use('/', authRoutes)

// Use movie routes
app.use('/movies', movieRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Server is running on  http://127.0.0.1:${port}`)
})
