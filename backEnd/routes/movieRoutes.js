import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import { uploadMovie } from '../controller/movieController.js'

const movieRoute = express.Router()

movieRoute.post('/upload-movie',isAuth,uploadMovie)

export default movieRoute