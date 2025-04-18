"use strict";
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
const connection_1 = __importDefault(require("./db/connection"));
const passport_1 = __importDefault(require("passport"));
const googleRoute_1 = __importDefault(require("./routers/googleRoute"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
(0, connection_1.default)();
app.use(passport_1.default.initialize());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: false
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/google', googleRoute_1.default);
app.get('/', (req, res) => {
    res.json({ mesage: 'welcome to igotmessage' });
});
app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
});
