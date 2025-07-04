import express from 'express'
import { createPost, toggleLike } from '../controllers/postController'

const postRouter = express.Router()

postRouter.post('/create-post', createPost)
postRouter.post('/toggle-like/:postId', toggleLike)

export default postRouter