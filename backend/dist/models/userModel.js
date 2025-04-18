"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    googleId: { type: String },
    firebaseId: { type: String },
    email: { type: String },
    title: { type: String },
    avatar: { type: String },
    mobileNo: { type: Number },
    createdAt: { type: Date, default: Date.now() },
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
