import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
    
})
