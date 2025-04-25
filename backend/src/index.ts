import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import './services/googleOauth'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import gAuthRouter from './routers/googleRoute'
import emailAuthRouter from './routers/emailAuth'
import getCurrentUser from './routers/currentUser'
import prisma from './prisma/client'

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
app.use('/email/auth', emailAuthRouter)
app.use('/current-user', getCurrentUser)

app.get('/', (req, res) =>{
    res.json({mesage: 'welcome to igotmessage'})
})

app.get('/status', async (req, res) => {
    try {
      const dbTime = await prisma.$queryRaw`SELECT NOW()`;
      console.log('connected to postgres', req);
      
       res.send({ success: true, dbTime });
    } catch (err) {
      res.status(500).send({ error: 'DB not connected', details: err });
    }
  });
  
app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})
