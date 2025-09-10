import express from "express";
import {searchAllPeople, getAllPeople} from "../controllers/searchController";

const searchRouter = express.Router();

searchRouter.get("/get-all-people", getAllPeople);
searchRouter.post("/people", searchAllPeople);
searchRouter.post("/followers", searchAllPeople);
searchRouter.post("/following", searchAllPeople);

export default searchRouter;