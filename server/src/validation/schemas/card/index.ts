import { body, param } from 'express-validator';

const minIdLength = 9;
const minTitleLength = 1;
const minDescriptionLength = 1;

export const createCardValidation = [
  body('columnId').isLength({ min: minIdLength }),
  body('title').isLength({ min: minTitleLength }),
  body('description').isLength({ min: minDescriptionLength }),
];

export const updateCardValidation = [
  param('id').isLength({ min: minIdLength }),
];

export const removeCardValidation = [
  param('id').isLength({ min: minIdLength }),
];
