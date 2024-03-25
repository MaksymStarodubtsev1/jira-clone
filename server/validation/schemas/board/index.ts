import { body, param } from 'express-validator';

const minIdLength = 9;
const minTitleLength = 2;

export const createBoardValidation = [
  body('title').isLength({ min: minTitleLength })
];

export const updateBoardValidation = [
  param('id').isLength({ min: minIdLength }),
  body('title').isLength({ min: minTitleLength }),
];

export const removeBoardValidation = [
  param('id').isLength({ min: minIdLength }),
];
