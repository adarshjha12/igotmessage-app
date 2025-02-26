import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './db/connection'
import passport from 'passport'
import router from './routers/authRoute'

const PORT = process.env.PORT
const app = express()
connectDb()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(router)

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})
