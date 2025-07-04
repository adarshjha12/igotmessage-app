import { Router } from 'express';
import { sendOtp, verifyOtp, testRedis } from '../controllers/emailAuthController';

const emailAuthRouter = Router();

emailAuthRouter.post('/send-otp', sendOtp);
emailAuthRouter.post('/verify-otp', verifyOtp);
emailAuthRouter.get('/redis', testRedis);

export default emailAuthRouter;