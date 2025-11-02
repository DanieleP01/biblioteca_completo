import { Request, Response } from 'express';
import * as reservationModel from '../models/reservations.js';
import { checkDuplicateLoan } from '../models/loans.js';

  // Gestisce la richiesta di creazione di una nuova prenotazione
  export async function createReservationController(req: Request, res: Response) {
    
    const { user_id, book_id, library_id } = req.body;

    if (!user_id || !book_id || !library_id) {
      return res.status(400).json({ error: 'Dati mancanti. Sono richiesti user_id, book_id e library_id.' });
    }

    try {
      const existingLoan = await checkDuplicateLoan(user_id, book_id);
      if (existingLoan) {
        return res.status(409).json({ error: 'Hai già un prestito attivo per questo libro.' });
      }

      const existingReservation = await reservationModel.findPendingReservation(user_id, book_id, library_id);
      if (existingReservation) {
        return res.status(409).json({ error: 'Hai già prenotato questo libro in questa biblioteca.' });
      }

      const newReservation = await reservationModel.createReservation(user_id, book_id, library_id);
      
      res.status(201).json(newReservation);

    } catch (error) {
      console.error('Errore creazione prenotazione:', error);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }