import { Router } from 'express';
import { check } from 'express-validator';
import { createTransaction, revertTransaction } from './transaction.controller.js';
import { validarJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.post(
    "/transfer",
    [
        validarJWT,
        check('amount', 'The amount is required').not().isEmpty().isNumeric(),
        check('toAccount', 'The acountNumber is required').not().isEmpty(),
    ], createTransaction)

router.put(
    "/revert/:transactionId",
    [
        validarJWT,
    ], revertTransaction)

export default router;