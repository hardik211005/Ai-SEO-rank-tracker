import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import rankRouter from './routes/rankRoutes.js';

connectDB();
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', authRouter);
app.use('/api/rank', rankRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});