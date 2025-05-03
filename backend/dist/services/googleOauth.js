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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = __importDefault(require("../prisma/client"));
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://igotmessage-app-backend.onrender.com/api/google/auth/callback/redirect'
    : 'http://localhost:5000/api/google/auth/callback/redirect';
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        let user = yield client_1.default.user.findFirst({ where: { googleId: profile.id } });
        if (!user) {
            if ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) {
                user = yield client_1.default.user.findFirst({ where: { email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value } });
                if (user) {
                    user = yield client_1.default.user.update({
                        where: { email: (_f = (_e = profile.emails) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value },
                        data: { googleId: profile.id }
                    });
                }
            }
            if (!user) {
                user = yield client_1.default.user.create({
                    data: {
                        googleId: profile.id,
                        email: ((_h = (_g = profile.emails) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.value) || '',
                        title: profile.displayName,
                        avatar: ((_k = (_j = profile.photos) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.value) || ''
                    }
                });
            }
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, undefined);
    }
})));
