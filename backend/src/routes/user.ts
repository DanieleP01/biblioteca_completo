import { Router } from 'express';
import { registerController } from '../controllers/userController.js';

const router = Router();
router.post('/registrazione', registerController);

export default router;