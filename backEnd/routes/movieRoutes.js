import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import { getMovies, getPresignedUploadUrl, saveMovieMetadata, } from '../controller/movieController.js'

const movieRoute = express.Router()

movieRoute.post('/upload-movie',isAuth,saveMovieMetadata)
movieRoute.get("/get-movies", getMovies);
movieRoute.post("/get-upload-url", isAuth, getPresignedUploadUrl);

export default movieRoute