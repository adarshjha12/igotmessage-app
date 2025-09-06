import express from "express";
import profileUpdateController, { getProfile } from "../controllers/profileUpdateController";
import upload from "../middlewares/multer";

const profileRouter = express.Router();

profileRouter.post(
  "/update",
  upload.single("profilePic"),
  profileUpdateController
);

profileRouter.get("/get-profile", getProfile);

export default profileRouter