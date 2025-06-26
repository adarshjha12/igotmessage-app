import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { getOtpEmailHtml } from '../utils/loadTemplate';
import { User } from '../models/userModel';
import syncFailuresQueue from '../utils/dbSyncQueue';
import client from '../services/redisClient';
import apiInstance from '../services/brevoClient';

const generateOTP = (): string => Math.floor(1000 + Math.random() * 9000).toString();

export const sendOtp = async (req: Request, res: Response) : Promise<any> => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const otp = generateOTP();
  await client.set(`otp:${email}`, otp, 'EX', 300); // 5 min expiry

  const htmlContent = getOtpEmailHtml({ otp });

  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: process.env.EMAIL_FROM!, name: 'igotmessage' },
    subject: 'Your verification Code',
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(403).json({ success: false, message: 'Invalid email provided' });
  }
};

export const verifyOtp = async (req: Request, res: Response) : Promise<any> => {
  const { email, otp } = req.body;
  const storedOtp = await client.get(`otp:${email}`);

  if (!storedOtp)
    return res.status(400).json({ success: false, expired: true, message: 'OTP expired. Please resend again' });

  if (storedOtp !== otp)
    return res.status(400).json({ success: false, message: 'Invalid OTP' });

  let user;
  try {
    user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    try {
      const sanitizedUser: Record<string, any> = {...user} 
      if (sanitizedUser.phoneNo === null ||  sanitizedUser.phoneNo === undefined) {
          delete sanitizedUser.phoneNo
      }

      await User.updateOne({ uid: sanitizedUser.id }, { $set: sanitizedUser }, { upsert: true });
    } catch (error) {
      syncFailuresQueue.push({ user, attempts: 0 });
      console.error('MongoDB sync failed', error);
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'User not created', userData: user });
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET!);

  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ success: true, message: 'OTP verification successful', userData: user });
};

export const testRedis = async (req: Request, res: Response) => {
  await client.set('hello', 'adarsh');
  const resp = await client.get('hello');
  console.log(resp);
  res.send(resp);
};
