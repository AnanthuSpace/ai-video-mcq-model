import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();
import { errorHandler } from "./middlewares/errorHandler"
// import { connectDB } from "./config/db"
import mcqRouter from "./routes/mcq.router"

export const app = express()

app.use(cors())
app.use(express.json())

// connectDB()

app.use("/api/videos", mcqRouter);

app.use(errorHandler)