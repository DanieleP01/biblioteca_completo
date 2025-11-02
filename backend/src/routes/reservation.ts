import { Router } from 'express';
import * as reservationController from '../controllers/reservationsController.js';

const router = Router();

//crea prenotazione
router.post('/create-reservation', reservationController.createReservationController);

export default router;