import { Request, Response } from 'express';
import * as reservationModel from '../models/reservations.js';
import { checkDuplicateLoan } from '../models/loans.js';
import * as BooksModel from '../models/books.js';
import * as LibraryModel from '../models/library.js';
import * as NotificationsModel from '../models/notifications.js';

//Richiesta di creazione di una nuova prenotazione
export async function createReservationController(req: Request, res: Response) {
  const { user_id, book_id, library_id } = req.body;

  if (!user_id || !book_id || !library_id) {
    return res.status(400).json({ error: 'Dati mancanti. Sono richiesti user_id, book_id e library_id.' });
  }

  try {
    //controllo su prestito
    const existingLoan = await checkDuplicateLoan(user_id, book_id);
    if (existingLoan) {
      return res.status(409).json({ error: 'Hai già un prestito attivo per questo libro.' });
    }

    //controllo su prenotazione
    const existingReservation = await reservationModel.findUserPendingReservation(user_id, book_id, library_id);
    if (existingReservation) {
      return res.status(409).json({ error: 'Hai già prenotato questo libro in questa biblioteca.' });
    }

    //crea nuova prenotazione
    const newReservation = await reservationModel.createReservation(user_id, book_id, library_id);
    
    // NOTIFICA AL BIBLIOTECARIO
    const library = await LibraryModel.getLibraryById(library_id);
    const book = await BooksModel.getBookById(book_id);
    
    if (library) {
      await NotificationsModel.createNotification({
        recipient_id: library.manager_id,
        recipient_role: 'librarian',
        title: 'Nuova Prenotazione',
        message: `l'utente "${user_id}" ha prenotato "${book.title}". La prenotazione è in attesa di processamento.`,
        type: 'reservation_received'
      });
    }

    res.status(201).json(newReservation);

  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
  }

// Gestisce la richiesta di ottenere tutte le prenotazioni per una biblioteca specifica e un libro specifico
export async function getReservationsByLibraryAndBookController(req: Request, res: Response) {
  const { libraryId, bookId } = req.params;
  try {
    const reservations = await reservationModel.findReservationsByLibraryAndBook(Number(libraryId), Number(bookId));
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Errore nel recupero delle prenotazioni:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}
