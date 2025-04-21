import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import './services/googleOauth'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './db/connection'
import passport from 'passport'
import gAuthRouter from './routers/googleRoute'

const PORT = process.env.PORT
const app = express()
connectDb()

const allowedOrigins = ['http://localhost:3000', 'https://igotmessage-app-frontend.vercel.app/']

app.use(passport.initialize())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/google', gAuthRouter)

app.get('/', (req, res) =>{
    res.json({mesage: 'welcome to igotmessage'})
})

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})
