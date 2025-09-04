import express from "express";
import { addComment, addReply, getCommentAndReplies } from "../controllers/commentController";
const commentRouter = express.Router();

commentRouter.post("/add-comment", addComment);
commentRouter.post("/add-reply", addReply);
commentRouter.post("/get-comments", getCommentAndReplies);

export default commentRouter;
