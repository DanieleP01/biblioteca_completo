import { Router } from 'express';
import * as CopiesController from '../controllers/copiesController.js';

const router = Router();

//Nuova Richiesta di copia
router.post('/copy-requests', CopiesController.createCopyRequest);

export default router;
