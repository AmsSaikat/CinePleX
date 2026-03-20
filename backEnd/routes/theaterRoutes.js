import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import {  createTheater,getMyTheaters,getTheaterById,updateTheater,deleteTheater, joinTheater } from '../controller/theaterController.js'

const theaterRoute = express.Router();

theaterRoute.post("/create-theater", isAuth, createTheater);
theaterRoute.get("/get-theater/mine", isAuth, getMyTheaters);
theaterRoute.get("/get-theater/code/:code", isAuth, getTheaterById);
theaterRoute.put("/update-theater/:id", isAuth, updateTheater);
theaterRoute.delete("/delete-theater/:id", isAuth, deleteTheater);
theaterRoute.post("/join-theater", isAuth, joinTheater);

export default theaterRoute;