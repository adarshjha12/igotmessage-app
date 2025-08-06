import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import './services/googleOauth'
import connectToMongoDB  from './db/connection'
connectToMongoDB()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import gAuthRouter from './routers/googleRoute'
import emailAuthRouter from './routers/emailAuth'
import getCurrentUser from './routers/currentUser'
import redisClient from './services/redisClient'
import followRouter from './routers/followRoute'
import postRouter from './routers/postRoutes'
import commentRouter from './routers/commentRoute'
import storyRouter from './routers/storyRoute'
import guestRouter from './routers/guestRoute'

const PORT = process.env.PORT
const app = express()

const allowedOrigins = ['http://localhost:3000', 'https://igotmessage-app-frontend.vercel.app']

app.use(passport.initialize())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/google', gAuthRouter)
app.use('/api/email/auth', emailAuthRouter)
app.use('/api/current-user', getCurrentUser)
app.use('/api/follow', followRouter)
app.use('/api/post', postRouter)
app.use('/api/commemt', commentRouter)
app.use('/api/story', storyRouter)
app.use('/api/guest', guestRouter)

app.get('/', (req, res) =>{
    res.json({mesage: 'welcome to igotmessage'})
})

app.get('/healthCheck', (req, res) =>{
    res.status(200);
})

  // keep redis alive
  setInterval(async () => {
  await redisClient.set('keep_alive', Date.now().toString());
  console.log('Redis pinged to keep alive');
}, 1000 * 60 * 60 * 24 * 3);
  

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})