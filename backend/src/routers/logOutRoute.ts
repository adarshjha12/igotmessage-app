import express from 'express'
import logOut from '../controllers/logOutController'

const logOutRouter = express.Router()

logOutRouter.get('/', logOut)

export default logOutRouter