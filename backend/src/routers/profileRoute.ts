import express from "express";
import profileUpdateController from "../controllers/profileUpdateController";
import upload from "../middlewares/multer";

const profileRouter = express.Router();

profileRouter.post(
  "/update",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  profileUpdateController
);

export default profileRouter