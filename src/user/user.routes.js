import { Router } from 'express';
import { check } from 'express-validator';
import {
    addUser,
    validateAddUser,
    getUsers,
    getUsersAdmins,
    updateUser,
    myDetails,
    getUser,
    editMyUser
} from '../user/user.controller.js';

import { 
    existUsername,
    existEmail,
    existDpi,
    existPhone,
} from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validarJWT } from '../middlewares/validate-jwt.js'

const router = Router();

router.get("/users", getUsers);

router.get("/admins", getUsersAdmins);

router.post(
    "/register",
    [
        check('username', 'The username is required').not().isEmpty(),
        check('username').custom(existUsername),
        check('names', 'The names is required').not().isEmpty(),
        check('lastNames', 'The lastNames is required').not().isEmpty(),
        check('dpi', 'The dpi is required').not().isEmpty(),
        check('dpi').custom(existDpi),
        check('address', 'The address is required').not().isEmpty(),
        check('phone', 'The phone is required').isLength({ min: 8 }),
        check('phone').custom(existPhone),
        check('email', 'The email is required').not().isEmpty(),
        check('email').custom(existEmail),
        check('job', 'The job is required').not().isEmpty(),
        check('monthlyIncome', 'The monthlyIncome is required').not().isEmpty().isNumeric(),
        check('type', 'The type is required').not().isEmpty(),
        validateFields
    ], validateAddUser, addUser)

router.put(
    "/update/:id",
    [
        check('id', 'The id is required').not().isEmpty(),
        check('password', 'The password is required').isLength({ min: 8 }),
        validateFields
    ], updateUser)

router.put(
    "/editMyUser",
    [
        validarJWT,
        check('names', 'The names is required').not().isEmpty(),
        check('lastNames', 'The lastNames is required').not().isEmpty(),
        check('address', 'The address is required').not().isEmpty(),
        check('job', 'The job is required').not().isEmpty(),
        check('monthlyIncome', 'The monthlyIncome is required').not().isEmpty().isNumeric(),
        validateFields
    ], editMyUser)

router.get("/myDetails",
    validarJWT,
    myDetails
)

router.get("/detailsUser/:id",
    [
        check('id', 'This id is required').not().isEmpty(),
    ], getUser)



export default router;