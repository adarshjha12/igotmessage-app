import mongoose, {Document} from 'mongoose'

interface User extends Document{
    googleId?: string
    email?: string
    title?: string
    avatar?: string
    mobileNo?: number
    createdAt?: Date
}

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true},
    email: { type: String, unique: true},
    title: { type: String},
    avatar: { type: String},
    mobileNo: { type: Number, unique: true},
    createdAt: { type: Date, default: Date.now().toLocaleString },
})

export const UserModel = mongoose.model<User>('User', userSchema)