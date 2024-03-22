import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { CardController, BoardController } from './controllers';
import { uniqueBoardMiddleware } from './utils';

//For env File
dotenv.config();

const app: Application = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/board', uniqueBoardMiddleware, BoardController.create);
app.get('/board', BoardController.getOne);
app.get('/boards', BoardController.getMany);
app.patch('/board/:id', uniqueBoardMiddleware, BoardController.update);
app.delete('/board/:id', BoardController.remove);

app.post('/card', CardController.create);
app.patch('/card/:id', CardController.update);
app.delete('/card/:id', CardController.remove);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
