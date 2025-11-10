import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
