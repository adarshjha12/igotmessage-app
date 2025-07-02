import axios from "axios";

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

const uploadStory = async function(image: Blob, musicData?: {}) {
    const url = process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/story/upload-story` : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/story/upload-story`;

    const formdata = new FormData();
    formdata.append('file', image);

    return await axios.post(url, {formdata, musicData}, {withCredentials: true})
    
}

export {checkAuth, sendOtp, verifyOtp, uploadStory}