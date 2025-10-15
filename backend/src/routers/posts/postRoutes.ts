import express from "express";
import {
  createPost,
  createRepost,
  getBookmarkedPosts,
  getPosts,
  getPostsByUserId,
  getReels,
  handleVotes,
  toggleBookmark,
  toggleLike,
} from "../controllers/postController";
import upload from "../../middlewares/multer";

const postRouter = express.Router();

postRouter.post("/create-post", upload.array("files"), createPost);
postRouter.post("/create-repost", createRepost);
postRouter.post("/toggle-like", toggleLike);
postRouter.get("/get-posts", getPosts);
postRouter.get("/get-reels", getReels);
postRouter.get("/get-bookmarked-posts", getBookmarkedPosts);
postRouter.post("/vote", handleVotes);
postRouter.get("/get-single-user-post", getPostsByUserId);
postRouter.post("/toggle-bookmark", toggleBookmark);
export default postRouter;
