import express from 'express'
import handleGuestAuth from '../controllers/guestAuthController'

const guestRouter = express.Router()

guestRouter.get("/guest-auth", handleGuestAuth)

export default guestRouter