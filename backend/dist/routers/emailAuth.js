"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
const ioredis_1 = __importDefault(require("ioredis"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const client = new ioredis_1.default(process.env.REDIS_URL);
const emailAuthRouter = (0, express_1.Router)();
client.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});
const defaultClient = sib_api_v3_sdk_1.default.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
emailAuthRouter.post('/send-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
    }
    const otp = generateOTP();
    yield client.set(`otp:${email}`, otp, 'EX', 300);
    const apiInstance = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
    const sendSmtpEmail = {
        to: [{ email }],
        sender: { email: process.env.EMAIL_FROM, name: 'igotmessage' },
        subject: 'Your verification Code',
        htmlContent: `<h3>Your OTP is: ${otp}</h3><p>Expires in 5 minutes.</p>`,
    };
    try {
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ success: true, message: 'OTP sent' });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: 'invalid email provided' });
    }
}));
emailAuthRouter.post('/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const storedOtp = yield client.get(`otp:${email}`);
    if (!storedOtp) {
        res.status(400).json({ success: false, expired: true, message: 'otp expired. please resend again' });
        return;
    }
    if (storedOtp !== otp) {
        res.status(400).json({ success: false, message: 'invalid otp' });
        return;
    }
    let user;
    try {
        user = yield client_1.default.user.findFirst({ where: { email: email } });
        if (!user) {
            user = yield client_1.default.user.create({
                data: {
                    email: email
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'user not created', userData: user });
        console.log(error);
        return;
    }
    console.log(user);
    const payload = {
        id: user === null || user === void 0 ? void 0 : user.id,
        email: user === null || user === void 0 ? void 0 : user.email
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
    res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ success: true, message: 'otp verification successfull', userData: user });
}));
emailAuthRouter.get('/redis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.set('hello', 'adarsh');
    const resp = yield client.get('hello');
    console.log(resp);
    res.send(resp);
}));
exports.default = emailAuthRouter;
