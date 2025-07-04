import express from 'express'
import { createPost, toggleLike } from '../controllers/postController'

const postRoute = express.Router()

postRoute.post('/create-post', createPost)
postRoute.post('/toggle-like/:postId', toggleLike)

export default postRoute