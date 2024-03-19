import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/column', (req: Request, res: Response) => {
  try {
    if (req.body.id) {
    }
  } catch (err) {}
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
