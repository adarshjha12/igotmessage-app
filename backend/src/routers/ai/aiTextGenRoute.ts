import express from "express";
import axios from "axios";
import aiTextGenController from "../controllers/ai/aiTextGenController";

const aiTextGenRouter = express.Router();

aiTextGenRouter.post("/", aiTextGenController);

export default aiTextGenRouter;
