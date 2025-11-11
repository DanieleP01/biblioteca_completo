import { Router } from 'express';
import * as reservationController from '../controllers/reservationsController.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = Router();

//crea prenotazione
router.post('/create-reservation', reservationController.createReservationController);
//ottieni prenotazioni per biblioteca e libro
router.get('/libraries/:libraryId/books/:bookId/reservations', reservationController.getReservationsByLibraryAndBookController);

export default router;