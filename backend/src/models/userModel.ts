import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    uid: {
        type: Number,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    phoneNo: {
        type: Number,
        unique: true,
        sparse: true,
    },
    title: {
        type: String,
        default: "User",
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dqj3x4k2h/image/upload/v1735681234/avatars/default-avatar.png",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const User = mongoose.model("User", Schema);
export {User};