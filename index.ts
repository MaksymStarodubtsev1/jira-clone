import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';

//For env File
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/column', async (req: Request, res: Response) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Missing required field: title' });
    }

    const newColumn = await prisma.column.create({
      data: {
        title: req.body.title,
      },
    });

    res.status(200).json(newColumn);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating column' });
  }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
