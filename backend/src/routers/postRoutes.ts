import express from 'express'
import { createPost, createRepost, getPosts, getPostsByUserId, handleVotes, toggleLike } from '../controllers/postController'
import upload from '../middlewares/multer'

const postRouter = express.Router()

postRouter.post('/create-post', upload.array("files"), createPost)
postRouter.post('/create-repost', createRepost)
postRouter.post('/toggle-like', toggleLike)
postRouter.get('/get-posts', getPosts)
postRouter.post('/vote', handleVotes)
postRouter.get('/get-single-user-post', getPostsByUserId)
export default postRouter