import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import authRouter from "./routers/authRouter";
import { authenticateToken } from "./middlewares/authMiddleware";
import messagesRouter from "./routers/messagesRouter";
import userRouter from "./routers/userRouter";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/messages', authenticateToken, messagesRouter);
app.use('/api/users', authenticateToken, userRouter);

export default app;