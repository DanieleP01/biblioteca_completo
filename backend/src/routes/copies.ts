import { Router } from 'express';
import * as CopiesController from '../controllers/copiesController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

//Nuova Richiesta di copia
router.post('/request', CopiesController.createCopyRequest);

// Richieste di copie in attesa (admin)
router.get('/pending', CopiesController.getPendingRequestCopies);

// Approva richiesta di copie
router.patch('/:requestId/approve', CopiesController.approveCopyRequest);

// Rifiuta richiesta di copie
router.patch('/:requestId/reject', CopiesController.rejectCopyRequest);

export default router;
