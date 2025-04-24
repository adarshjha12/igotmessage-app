import axios from "axios";

const sendOtp = async function (email: string) {
    try {
        return await axios.post('https://igotmessage-app-backend.onrender.com/email/auth/send-otp', email)
    } catch (error) {
        console.log(error);
        
    }
}

const verifyOtp = async function (email: string, otp: string) {
    try {
        return await axios.post('https://igotmessage-app-backend.onrender.com/email/auth/verify-otp', {email, otp})
    } catch (error) {
        console.log(error);
    }
}

export {sendOtp, verifyOtp}