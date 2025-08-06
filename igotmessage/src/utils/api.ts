import axios from "axios";
import { headers } from "next/headers";

const checkAuth = async function () {
    const url = process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/current-user/get-current-user`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/current-user/get-current-user`;

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
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/email/auth/send-otp`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/email/auth/send-otp`;

    try {
        return await axios.post(url, {email})
    } catch (error) {
        console.log(error);
        throw error
    }
}

const verifyOtp = async function (email: string, otp: string) {

    const url = process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/email/auth/verify-otp`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/email/auth/verify-otp`;

    
    try {
        
        return await axios.post(url, {email, otp}, {withCredentials: true})
    } catch (error) {
        console.log(error);
        throw error
    }
}

const fetchMyStories = async function(userId : string) {
    const url = process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/story/get-my-stories` : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/story/get-my-stories`;

    return await axios.post(url, {userId}, {withCredentials: true})
}
const fetchOtherStories = async function() {
    const url = process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/story/get-other-stories` : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/story/get-other-stories`;

    return await axios.get(url,  {withCredentials: true})
}

const handleGuest = async () => {
    try {
        const url = process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/guest/guest-auth` : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/guest/guest-auth`;

        return await axios.get(url, {withCredentials: true})
    } catch (error) {
        console.log('error while handling guest signin', error);
    }
}

export {checkAuth, handleGuest, sendOtp, verifyOtp, fetchMyStories, fetchOtherStories}