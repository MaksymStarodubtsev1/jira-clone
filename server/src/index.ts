import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { CardController, BoardController } from './controllers';
import { uniqueBoardMiddleware } from './utils';
import {
  createBoardValidation,
  removeBoardValidation,
  updateBoardValidation,
} from './validation/schemas/board';
import handleValidationError from './validation/utils/handleValidationError';
import {
  createCardValidation,
  removeCardValidation,
  updateCardValidation,
} from './validation/schemas/card';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.BACKEND_URL || 8001;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.post(
  '/board',
  createBoardValidation,
  handleValidationError,
  uniqueBoardMiddleware,
  BoardController.create
);
app.get('/board', BoardController.getOne);
app.get('/boards', BoardController.getMany);
app.patch(
  '/board/:id',
  updateBoardValidation,
  handleValidationError,
  uniqueBoardMiddleware,
  BoardController.update
);
app.delete(
  '/board/:id',
  removeBoardValidation,
  handleValidationError,
  BoardController.remove
);

app.post(
  '/card',
  createCardValidation,
  handleValidationError,
  CardController.create
);
app.patch(
  '/card/:id',
  updateCardValidation,
  handleValidationError,
  CardController.update
);
app.delete(
  '/card/:id',
  removeCardValidation,
  handleValidationError,
  CardController.remove
);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
