import express from "express";
import {searchAllPeople, getAllPeople, searchFollowers, searchFollowing} from "../../controllers/search/searchController";

const searchRouter = express.Router();

searchRouter.get("/get-all-people", getAllPeople);
searchRouter.post("/people", searchAllPeople);
searchRouter.post("/followers", searchFollowers);
searchRouter.post("/following", searchFollowing);

export default searchRouter;