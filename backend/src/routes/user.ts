import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

//login
router.post('/login', userController.loginController);

//registrazione
router.post('/registrazione', userController.registerController);

//Dettagli profilo
router.get('/details-profile/:id', userController.getDetailsProfile);

export default router;