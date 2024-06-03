import { Router } from 'express';
import { check } from 'express-validator';

import { 
    addService
} from '../service/service.controller.js';

import { validateFields } from '../middlewares/validate-fields.js';

const router = Router();

router.post(
    "/add",
    [
        check('nameService', 'The nameService is required').not().isEmpty(),
        check('description', 'The description is required').not().isEmpty(),
        check('price', 'The price is required').not().isEmpty(),
        validateFields
    ], addService)
    
export default router;
