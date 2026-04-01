import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import {updateProfile} from '../controller/userController.js'

const userRoute=express.Router()

userRoute.post('/update-profile',isAuth,updateProfile)

export default userRoute