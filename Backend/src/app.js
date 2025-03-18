import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "https://67d8f666adb4d0ab43b7af8e--myperplexity.netlify.app/",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Current-Type"],
    })
);

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());



import router from './routes/user.routes.js';
app.use("/api/v1/users", router);

export { app }