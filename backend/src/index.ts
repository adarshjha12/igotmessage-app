import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./services/googleOauth";
import connectToMongoDB from "./db/connection";
connectToMongoDB();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "passport";
import gAuthRouter from "./routers/auth/googleRoute";
import emailAuthRouter from "./routers/auth/emailAuth";
import getCurrentUser from "./routers/profile/currentUser";
import redisClient from "./services/redisClient";
import postRouter from "./routers/posts/postRoutes";
import commentRouter from "./routers/posts/commentRoute";
import storyRouter from "./routers/story/storyRoute";
import guestRouter from "./routers/auth/guestRoute";
import profileRouter from "./routers/profile/profileRoute";
import logOutRouter from "./routers/profile/logOutRoute";
import aiTextGenRouter from "./routers/ai/aiTextGenRoute";
import searchRouter from "./routers/search/searchRoute";
import { User } from "./models/userModel";
import InitSocket from "./services/socket";
import http from "http";
import uploadAuth from "./routers/uploadAuth";
import { chatRouter } from "./routers/chats/chatRouter";

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const socketService = new InitSocket();

const allowedOrigins = [
  "http://localhost:3000",
  "https://igotmessage-app-frontend.vercel.app",
];

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(passport.initialize());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use("/api/google", gAuthRouter);
app.use("/api/email/auth", emailAuthRouter);
app.use("/api/current-user", getCurrentUser);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/story", storyRouter);
app.use("/api/guest", guestRouter);
app.use("/api/profile", profileRouter);
app.use("/api/logout", logOutRouter);
app.use("/api/text/ai", aiTextGenRouter);
app.use("/api/search", searchRouter);
app.use("/api/upload", uploadAuth)
app.use("/api/chat", chatRouter)

socketService.io.attach(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
});
socketService.initListners();

app.get("/", (req, res) => {
  res.json({ mesage: "welcome to igotmessage" });
});

app.get("/healthCheck", (req, res) => {
  res.status(200);
});

setInterval(async () => {
  try {
    await redisClient.ping();
    console.log("Redis pinged to keep alive");
  } catch (err) {
    console.error("Failed to ping Redis:", err);
  }
}, 1000 * 60 * 60 * 24 * 3);

server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
