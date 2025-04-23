"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
const emailAuthRouter = express_1.default.Router();
const defaultClient = sib_api_v3_sdk_1.default.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
exports.default = emailAuthRouter;
