import express from "express";
import { addComment, addReply, getCommentAndReplies } from "../../controllers/posts/commentController";
const commentRouter = express.Router();

commentRouter.post("/add-comment", addComment);
commentRouter.post("/add-reply", addReply);
commentRouter.post("/get-comments", getCommentAndReplies);

export default commentRouter;
