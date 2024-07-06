import e, { Router } from "express";
import { check } from "express-validator";
import { addFavorite } from "./account.controller.js";
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

export default router;