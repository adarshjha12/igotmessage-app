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
require("../services/googleOauth");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const userModel_1 = require("../models/userModel");
const authRouter = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
authRouter.get('/auth/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
}));
authRouter.get('/auth/callback/redirect', passport_1.default.authenticate('google', { session: false }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let userInDb = yield userModel_1.UserModel.findOne({ googleId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.googleId });
            const payload = {
                id: userInDb === null || userInDb === void 0 ? void 0 : userInDb._id,
                title: userInDb === null || userInDb === void 0 ? void 0 : userInDb.title,
                email: userInDb === null || userInDb === void 0 ? void 0 : userInDb.email,
            };
            console.log(req.user);
            const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
            res.cookie('googleToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.redirect(FRONTEND_URL);
        }
        catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    });
});
exports.default = authRouter;
