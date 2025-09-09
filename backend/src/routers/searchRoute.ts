import express from "express";
import searchController from "../controllers/searchController";

const searchRouter = express.Router();

searchRouter.get("/get-all-people", searchController);

export default searchRouter;