import { Router } from 'express';
import { getCurrentUser } from '../../controllers/profile/getCurrentUserController';

const getCurrentUserRouter = Router();

getCurrentUserRouter.get('/get-current-user', getCurrentUser);

export default getCurrentUserRouter;
