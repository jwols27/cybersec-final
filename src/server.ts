import 'dotenv/config';
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import apiRoutes from './routes/api';

const app = express();
app.use(
	cors({
		origin: true,
		credentials: true
	})
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api', apiRoutes);

const port = 3443;

const options = {
	key: fs.readFileSync(process.env.TLS_KEY ?? './certs/server.key'),
	cert: fs.readFileSync(process.env.TLS_CERT ?? './certs/server.crt'),
	ca: fs.readFileSync(process.env.TLS_CA ?? './certs/ca.crt'),
	requestCert: true,
	rejectUnauthorized: false
};

https.createServer(options, app).listen(port, () => console.log(`HTTPS server at https://localhost:${port}`));
