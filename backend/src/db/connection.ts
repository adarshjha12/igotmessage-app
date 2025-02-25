import mongoose from 'mongoose'
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    throw new Error('MONGO_URI not provided')
}

const connectDb = async function () {
    try {
        await mongoose.connect(MONGO_URI!)
        console.log('db connected successfully');
        
    } catch (error) {
        console.log('connection unsuccessfull', error);
        
    }
}

export default connectDb