import express from "express";
import profileUpdateController, { getProfile } from "../controllers/profileUpdateController";
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

profileRouter.get("/get-profile", getProfile);

export default profileRouter