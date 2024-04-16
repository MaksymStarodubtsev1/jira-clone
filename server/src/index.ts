import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from "../prisma/client";

import board from "./routes/board";
import card from "./routes/card";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.BACKEND_URL || 8001;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.use('/board', board);
app.use('/card', card)

app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found!' })
})

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found!' });
})

app.listen(port, async () => {
  prisma.$connect()
      .then(() => console.log('Database connected!'))
      .catch(() => console.log('Database connection error!'))

  console.log(`Server is Fire at http://localhost:${port}`);
});

