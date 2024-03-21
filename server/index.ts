import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

import { CardController, BoardController } from './controllers';
import { uniqueBoardMiddlevare } from './utils';

//For env File
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/board', uniqueBoardMiddlevare, BoardController.create);
app.get('/board', BoardController.getOne);
app.patch('/board/:id', uniqueBoardMiddlevare, BoardController.update);
app.delete('/board/:id', BoardController.remove);

app.post('/card', CardController.create);
app.patch('/card/:id', CardController.update);
app.delete('/card/:id', CardController.remove);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});