import e, { Router } from "express";
import { check } from "express-validator";
import { addFavorite, obtenerCuentasAsc, obtenerDetallesCuenta } from "./account.controller.js";
import { validarJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/addFavorite",
    [
        validarJWT,
        check("accountNumber", "The accountNumber is required").not().isEmpty(),
        check("alias", "The alias is required").not().isEmpty(),
    ],
    addFavorite
);

router.get('/accounts-by-movements', [
    check('order', 'The order is required').not().isEmpty(),
],obtenerCuentasAsc);

router.get('/detailsAccount/:accountId',
    obtenerDetallesCuenta);

export default router;