import {Router} from 'express'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'
import { getOtpEmailHtml } from '../utils/loadTemplate'
import {User} from '../models/userModel'
import syncFailuresQueue from '../utils/dbSyncQueue'

const client = new Redis(process.env.REDIS_URL!)

const emailAuthRouter = Router()

client.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY

const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

emailAuthRouter.post('/send-otp', async (req, res) => {

  const {email} = req.body
  if (!email) {
     res.status(400).json({success: false, message: "Email is required" });
     return
  }
  
  const otp = generateOTP()

  await client.set(`otp:${email}`, otp, 'EX', 300)
  
  const htmlContent = getOtpEmailHtml({otp});
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: process.env.EMAIL_FROM!, name: 'igotmessage' },
    subject: 'Your verification Code',
    htmlContent: htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(403).json({ success: false, message: 'invalid email provided' });
  }

})

emailAuthRouter.post('/verify-otp', async (req, res)  => {
  const {email, otp} = req.body
  const storedOtp = await client.get(`otp:${email}`)

  
  if (!storedOtp) {
      res.status(400).json({success: false, expired:true, message: 'otp expired. please resend again'})      
      return
  }

  if (storedOtp !== otp) {
    res.status(400).json({success: false, message: 'invalid otp'})
    return
  }

  let user;
  try {
     user = await prisma.user.findFirst({where: {email: email}})

     if (!user) {      
      user = await prisma.user.create({
        data: {
          email: email
        }
      })
    }
    try {
        await User.updateOne(
        { uid: user.id},
        {$set: user},
        { upsert: true}
        )
      } catch (error) {
        syncFailuresQueue.push({user, attempts: 0});
        console.error('MongoDB sync failed', error);
    }
   
  } catch (error) {
    res.status(500).json({success: false, message: 'user not created', userData: user})
    console.log(error);
    return
  }

  console.log(user);

  const payload = {
    id: user?.id,
    email: user?.email
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET!)

  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
  
  res.status(200).json({success: true, message: 'otp verification successfull', userData: user})
})

emailAuthRouter.get('/redis', async (req, res) => {
  await client.set('hello', 'adarsh')
  const resp = await client.get('hello')
  console.log(resp);
  res.send(resp)
})
  
export default emailAuthRouter