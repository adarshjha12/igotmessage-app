import express from 'express'
import logOut from '../../controllers/profile/logOutController'

const logOutRouter = express.Router()

logOutRouter.get('/', logOut)

export default logOutRouter