import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import appRouter from './app';
import chalk from 'chalk';
import { createServer } from 'http';
import logger from './utils/logger';

dotenv.config();

const host = process.env.API_HOST ?? 'localhost';
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 5001;

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
);

// app.use(requestLogger);
app.use(logger);

app.use('/api', appRouter);

app.get('/', (_, res) => {
  res.send({ message: 'Hello from API' });
});
app.get('/health', (_, res) => {
  res.send({ message: 'API is healthy' });
});

httpServer.listen(port, host, () => {
  console.log(chalk.green(`[ ready ] http://${host}:${port}`));
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
