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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const getCurrentUser = (0, express_1.Router)();
getCurrentUser.get('/get-current-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token) {
        console.log('no token provided');
        res.status(401).json({ success: false, message: 'no token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const verifyUser = yield client_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!verifyUser) {
            res.status(401).json({ success: false, message: 'invalid token provided' });
            return;
        }
        console.log('user is authorized');
        res.status(200).json({ success: true, message: 'user verified successfully', userData: verifyUser });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server side error' });
    }
}));
exports.default = getCurrentUser;
