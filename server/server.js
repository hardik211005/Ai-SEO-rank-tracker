import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import rankRouter from './routes/rankRoutes.js';
import analysisRouter from './routes/analysisRoutes.js';
import { startRankTrackingCron } from './cron/rankTrackingCron.js';

connectDB();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://rankpiloyyt.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://rankpiloyyt.vercel.app"],
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', authRouter);
app.use('/api/rank', rankRouter);
app.use('/api/analysis', analysisRouter)

//start cron jobs
startRankTrackingCron()
const PORT = process.env.PORT || 3000;

export default app;