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
import gAuthRouter from "./routers/googleRoute";
import emailAuthRouter from "./routers/emailAuth";
import getCurrentUser from "./routers/currentUser";
import redisClient from "./services/redisClient";
import followRouter from "./routers/followRoute";
import postRouter from "./routers/postRoutes";
import commentRouter from "./routers/commentRoute";
import storyRouter from "./routers/storyRoute";
import guestRouter from "./routers/guestRoute";
import profileRouter from "./routers/profileRoute";
import logOutRouter from "./routers/logOutRoute";
import aiTextGenRouter from "./routers/aiTextGenRoute";
// import webhookRouter from "./routers/webhookRoute";

const PORT = process.env.PORT;
const app = express();

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
app.use("/api/follow", followRouter);
app.use("/api/post", postRouter);
app.use("/api/commemt", commentRouter);
app.use("/api/story", storyRouter);
app.use("/api/guest", guestRouter);
app.use("/api/profile", profileRouter);
app.use("/api/logout", logOutRouter);
app.use("/api/text/ai", aiTextGenRouter);

app.get("/", (req, res) => {
  res.json({ mesage: "welcome to igotmessage" });
});

app.get("/healthCheck", (req, res) => {
  res.status(200);
});

// keep redis alive
setInterval(async () => {
  await redisClient.set("keep_alive", Date.now().toString());
  console.log("Redis pinged to keep alive");
}, 1000 * 60 * 60 * 24 * 3);

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
