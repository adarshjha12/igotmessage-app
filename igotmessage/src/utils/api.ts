import axios from "axios";

const checkAuth = async function () {
    const url = process.env.NODE_ENV === 'production' 
    ? `${process.env.PRODUCTION_BACKEND_URL}/current-user/get-current-user`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/current-user/get-current-user`;

    try {
        return await axios.get(url, {
            withCredentials: true
        })
        
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

const sendOtp = async function (email: string) {
    const url = process.env.NODE_ENV === 'production' 
    ? `${process.env.PRODUCTION_BACKEND_URL}/email/auth/send-otp`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/email/auth/send-otp`;

    try {
        return await axios.post(url, {email})
    } catch (error) {
        console.log(error);
        throw error
    }
}

const verifyOtp = async function (email: string, otp: string) {

    const url = process.env.NODE_ENV === 'production' 
    ? `${process.env.PRODUCTION_BACKEND_URL}/email/auth/verify-otp`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/email/auth/verify-otp`;

    
    try {
        return await axios.post(url, {email, otp}, {withCredentials: true})
    } catch (error) {
        console.log(error);
        throw error
    }
}

export {checkAuth, sendOtp, verifyOtp}