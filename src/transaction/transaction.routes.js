import { Router } from 'express';
import { check } from 'express-validator';
import { performTransaction } from './transaction.controller.js';
import { validarJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.post(
    "/transfer",
    [
        validarJWT,
        check('amount', 'The amount is required').not().isEmpty().isNumeric(),
        check('dpi', 'The dpi is required').not().isEmpty(),
        check('acountNumber', 'The acountNumber is required').not().isEmpty(),
    ], performTransaction)

export default router;