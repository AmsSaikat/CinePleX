import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import theaterRoute from "./routes/theaterRoutes.js"
import { connectDB } from "./config/connectDB.js"
import cors from 'cors'
import http from 'http'
import setupChatSocket from "./config/socketConn.js"



dotenv.config()
connectDB()

const app=express()
app.use(express.json())
app.use(cookieParser())


const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.NETLIFY_URL
];


app.use(cors({
  origin: allowedOrigins,
  credentials: true,               
}));

app.use("/api/auth",authRouter)
app.use("/api/theater",theaterRoute)

const server=http.createServer(app)
setupChatSocket(server)




const PORT=process.env.PORT || 5000
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`))