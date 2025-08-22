import express from 'express'
import logOut from '../controllers/logOutController'

const logOutRouter = express.Router()

logOutRouter.post('/', logOut)

export default logOutRouter