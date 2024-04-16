import { Router } from "express";

import handleValidationError from "../validation/utils/handleValidationError";
import { createBoardValidation, removeBoardValidation, updateBoardValidation } from "../validation/schemas/board";
import { uniqueBoardMiddleware } from "../utils";
import { BoardController } from "../controllers";

const router = Router();

router.post(
    '/',
    createBoardValidation,
    handleValidationError,
    uniqueBoardMiddleware,
    BoardController.create
);
router.get('/findBySymbol/:symbol', BoardController.getBoardBySymbol);
router.get('/:id', BoardController.getBoard);
router.patch(
    '/:id',
    updateBoardValidation,
    handleValidationError,
    uniqueBoardMiddleware,
    BoardController.update
);
router.delete(
    '/:id',
    removeBoardValidation,
    handleValidationError,
    BoardController.remove
);

export default router;