import express from "express";
import { addComment } from "../controllers/commentController";
const commentRouter = express.Router();

commentRouter.post("/:postId", addComment);

export default commentRouter;
