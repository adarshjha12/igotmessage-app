import express from 'express'
import  {storyUploadController, getMyStoryController, getOtherStoryController}  from '../controllers/storyController'
import upload from "../middlewares/multer";

const storyRouter = express.Router()

storyRouter.post('/upload-story', upload.single("file"), storyUploadController)

storyRouter.post('/get-my-stories', getMyStoryController)

storyRouter.get('/get-other-stories', getOtherStoryController)

export default storyRouter