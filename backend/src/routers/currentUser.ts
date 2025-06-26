import { Router } from 'express';
import { getCurrentUser } from '../controllers/getCurrentUserController';

const getCurrentUserRouter = Router();

getCurrentUserRouter.get('/get-current-user', getCurrentUser);

export default getCurrentUserRouter;
