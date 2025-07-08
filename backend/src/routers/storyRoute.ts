import express from 'express'
import  storyUploaderControlller  from '../controllers/storyUploadController'
import upload from "../middlewares/multer";


const storyRouter = express.Router()

storyRouter.post('/upload-story', upload.single("file"), storyUploaderControlller)

export default storyRouter