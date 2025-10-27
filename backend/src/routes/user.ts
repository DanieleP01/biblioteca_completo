import { Router } from 'express';
import { loginController, registerController } from '../controllers/userController.js';

const router = Router();
router.post('/login', loginController);
router.post('/registrazione', registerController);

export default router;