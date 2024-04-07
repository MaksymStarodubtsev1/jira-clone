import { Router } from "express";
import { createCardValidation, removeCardValidation, updateCardValidation } from "../validation/schemas/card";
import handleValidationError from "../validation/utils/handleValidationError";
import { CardController } from "../controllers";
const router = Router();

router.post(
    '/',
    createCardValidation,
    handleValidationError,
    CardController.create
);
router.patch(
    '/:id',
    updateCardValidation,
    handleValidationError,
    CardController.update
);
router.delete(
    '/:id',
    removeCardValidation,
    handleValidationError,
    CardController.remove
);

export default router;