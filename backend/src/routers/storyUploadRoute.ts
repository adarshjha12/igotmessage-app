import express from 'express'
import  storyUploaderControlller  from '../controllers/storyUploadController'

const storyUploadRouter = express.Router()

storyUploadRouter.post('/upload-story', storyUploaderControlller)