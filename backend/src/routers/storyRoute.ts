import express from 'express'
import  storyUploaderControlller  from '../controllers/storyUploadController'

const storyRouter = express.Router()

storyRouter.post('/upload-story', storyUploaderControlller)