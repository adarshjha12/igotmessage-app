import express, { Request, Response } from 'express';
import admin from '../services/firebaseAdmin';
import { UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken';

const firebaseRouter = express.Router();

firebaseRouter.post('/verify-otp', async (req: Request, res: Response) : Promise<any> => {
    try {
        const { phoneNo, idToken } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        let user = await UserModel.findOne({ firebaseId: decodedToken.uid });

        if (!user) {
            user = await UserModel.create({
                firebaseId: decodedToken.uid, // Ensure this field exists in your schema
                mobileNo: phoneNo
            });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!)
        res.cookie('firebaseToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: 'User verified successfully', user: user });
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default firebaseRouter;