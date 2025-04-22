import express from 'express'
import SibApiV3Sdk from 'sib-api-v3-sdk'

const emailAuthRouter = express.Router()

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY

const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  
export default emailAuthRouter