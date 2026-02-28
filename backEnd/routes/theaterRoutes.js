import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import {  createTheater,getMyTheaters,getTheaterById,updateTheater,deleteTheater } from '../controller/theaterController.js'

const theaterRoute = express.Router();

theaterRoute.post("/create-theater", isAuth, createTheater);
theaterRoute.get("/get-theater/mine", isAuth, getMyTheaters);
theaterRoute.get("/get-theater/id/:id", isAuth, getTheaterById);
theaterRoute.put("/update-theater/:id", isAuth, updateTheater);
theaterRoute.delete("/delete-theater/:id", isAuth, deleteTheater);

export default theaterRoute;