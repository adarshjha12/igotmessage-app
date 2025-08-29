import express from 'express'
import { createPost, toggleLike } from '../controllers/postController'
import upload from '../middlewares/multer'


const postRouter = express.Router()

postRouter.post('/create-post', upload.array("files"), createPost)
postRouter.post('/toggle-like/:postId', toggleLike)

export default postRouter