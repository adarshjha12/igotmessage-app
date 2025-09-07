import express from "express";
import profileUpdateController, { getProfile, toggleFollow } from "../controllers/profileUpdateController";
import upload from "../middlewares/multer";
import followerController from "../controllers/followerController";

const profileRouter = express.Router();

profileRouter.post(
  "/update",
  upload.single("profilePic"),
  profileUpdateController
);

profileRouter.get("/get-profile", getProfile);
profileRouter.get("/get-followers", followerController);
profileRouter.post('/follow-toggle', toggleFollow)

export default profileRouter