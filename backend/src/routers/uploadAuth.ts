import { Router } from "express";
import imagekit from "../utils/imagekitConfig";

const uploadAuth = Router();

uploadAuth.get("/upload-auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
})

export default uploadAuth