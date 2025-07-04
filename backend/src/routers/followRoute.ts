import express from 'express'
import { followController } from '../controllers/followController'

const followRouter = express.Router()

followRouter.post('/follow-toggle/:targetUserId', followController)

export default followRouter