import mongoose, {Document} from 'mongoose'

export interface IUser extends Document{
    googleId?: string
    firebaseId?: string
    email?: string
    title?: string
    avatar?: string
    mobileNo?: number
    createdAt?: Date
}

const userSchema = new mongoose.Schema({
    googleId: { type: String},
    firebaseId: { type: String},
    email: { type: String},
    title: { type: String},
    avatar: { type: String},
    mobileNo: { type: Number},
    createdAt: { type: Date, default: Date.now()},
})

export const UserModel = mongoose.model<IUser>('User', userSchema)