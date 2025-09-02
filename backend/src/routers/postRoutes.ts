import express from 'express'
import { createPost, getPosts, toggleLike } from '../controllers/postController'
import upload from '../middlewares/multer'


const postRouter = express.Router()

postRouter.post('/create-post', upload.array("files"), createPost)
postRouter.post('/toggle-like', toggleLike)
postRouter.get('/get-posts', getPosts)
export default postRouter