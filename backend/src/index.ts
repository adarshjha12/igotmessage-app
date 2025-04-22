import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import './services/googleOauth'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import gAuthRouter from './routers/googleRoute'
import emailAuthRouter from './routers/emailAuth'

const PORT = process.env.PORT
const app = express()

const allowedOrigins = ['http://localhost:3000', 'https://igotmessage-app-frontend.vercel.app/']

app.use(passport.initialize())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/google', gAuthRouter)
app.use('/email', emailAuthRouter)

app.get('/', (req, res) =>{
    res.json({mesage: 'welcome to igotmessage'})
})

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})
