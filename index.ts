import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { BoardController } from './controllers';

//For env File
dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post('/board', BoardController.create);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
