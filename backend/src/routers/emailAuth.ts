import {Router} from 'express'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'

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
     res.status(400).json({ error: "Email is required" });
     return
  }
  
  const otp = generateOTP()

  await client.set(`otp:${email}`, otp, 'EX', 3000)
  
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: process.env.EMAIL_FROM!, name: 'igotmessage' },
    subject: 'Your verification Code',
    htmlContent: `<h3>Your OTP is: ${otp}</h3><p>Expires in 5 minutes.</p>`,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }

})

emailAuthRouter.post('/verify-otp', async (req, res)  => {
  const {email, otp} = req.body
  const storedOtp = await client.get(`otp:${email}`)

  console.log(email, otp, storedOtp);
  
  if (!storedOtp) {
      res.status(400).json({success: false, message: 'otp expired. please resend again'})
      return
  }

  if (storedOtp !== otp) {
     res.status(400).json({success: false, message: 'invalid otp'})
     return
  }

  const token = jwt.sign(email, process.env.JWT_SECRET!)

  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  const user = await prisma.user.create({
    data: {
      email: email
    }
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