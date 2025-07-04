import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    musicUrl: { type: String },
}, {timestamps: true})

export const Story = mongoose.model("Story", storySchema)