import express from 'express'
import  {storyUploadController, getMyStoryController, getOtherStoryController, getStoryByIdController}  from '../controllers/storyController'
import upload from "../middlewares/multer";

const storyRouter = express.Router()

storyRouter.post('/upload-story', upload.single("file"), storyUploadController)

storyRouter.post('/get-my-stories', getMyStoryController)

storyRouter.get('/get-other-stories', getOtherStoryController)

storyRouter.get('/get-story/:id', getStoryByIdController)

export default storyRouter