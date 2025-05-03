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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./services/googleOauth");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const googleRoute_1 = __importDefault(require("./routers/googleRoute"));
const emailAuth_1 = __importDefault(require("./routers/emailAuth"));
const currentUser_1 = __importDefault(require("./routers/currentUser"));
const client_1 = __importDefault(require("./prisma/client"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:3000', 'https://igotmessage-app-frontend.vercel.app/'];
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/google', googleRoute_1.default);
app.use('/api/email/auth', emailAuth_1.default);
app.use('/api/current-user', currentUser_1.default);
app.get('/', (req, res) => {
    res.json({ mesage: 'welcome to igotmessage' });
});
app.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbTime = yield client_1.default.$queryRaw `SELECT NOW()`;
        console.log('connected to postgres', req);
        res.send({ success: true, dbTime });
    }
    catch (err) {
        res.status(500).send({ error: 'DB not connected', details: err });
    }
}));
app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
});
