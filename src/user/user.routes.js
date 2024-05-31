import { Router } from 'express';
import { check } from 'express-validator';
import {
    addUser
} from '../user/user.controller.js';

import { existUser, validateAddUser } from '../helpers/db-validators.js';

const router = Router();

router.post(
    "/register",
    [
        check('username', 'The username is required').not().isEmpty(),
        check('username').custom(existUser),
        check('names', 'The names is required').not().isEmpty(),
        check('lastNames', 'The lastNames is required').not().isEmpty(),
        check('dpi', 'The dpi is required').not().isEmpty(),
        check('address', 'The address is required').not().isEmpty(),
        check('phone', 'The phone is required').not().isEmpty(),
        check('email', 'The email is required').not().isEmpty(),
        check('job', 'The job is required').not().isEmpty(),
        check('monthlyIncome', 'The monthlyIncome is required').not().isEmpty(),
        validateAddUser
    ], addUser)

export default router;