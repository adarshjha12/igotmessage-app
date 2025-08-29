import express from "express";
import axios from "axios";
import aiTextGenController from "../controllers/aiTextGenController";

const aiTextGenRouter = express.Router();

aiTextGenRouter.post("/", aiTextGenController);

export default aiTextGenRouter;
