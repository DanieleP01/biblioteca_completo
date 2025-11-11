import { Request, Response } from 'express';
import * as copiesModel from '../models/copies.js';
import * as libraryBooksModel  from '../models/libraryBooks.js';
import * as reservationModel from '../models/reservations.js';
import * as loanModel from '../models/loans.js';
import * as BooksModel from '../models/books.js';
import * as NotificationsModel from '../models/notifications.js';
import * as UserModel from '../models/user.js';

const admin_id = 12; //essendo unico l'admin, lo dichiaro esplicitamente

//crea una richiesta di copie (da parte del bibliotecario all'amministratore)
export async function createCopyRequest(req: Request, res: Response) {
    const { book_id, library_id, librarian_id, requested_copies, reason } = req.body;

    try {
      const book = await BooksModel.getBookById(book_id);

      const copyRequestId = await copiesModel.requestCopy(book_id, library_id, librarian_id, requested_copies, reason);
      
      // NOTIFICA ALL'ADMIN (unico)
      await NotificationsModel.createNotification({
        recipient_id: admin_id,
        recipient_role: 'admin',
        title: 'Nuova Richiesta di Copie',
        message: `Il bibliotecario ha richiesto ${requested_copies} copie del libro "${book.title}". Motivo: ${reason}`,
        type: 'copy_request_created',
      });

      res.status(201).json({ id: copyRequestId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Ottiene tutte le richieste di copie in attesa
export async function getPendingRequestCopies(req: Request, res: Response){

    try{
      const requestCopies = await copiesModel.getRequestCopies();
      res.json(requestCopies);
    }catch (error: any){
        res.status(500).json({ error: error.message });
    }
}

// Approva richiesta di copie e aggiunge le copie (admin)
export async function approveCopyRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;
    const { book_id, library_id, requested_copies } = req.body;

    // Validazione
    if (!requestId || !book_id || !library_id || !requested_copies) {
      return res.status(400).json({ error: 'Parametri obbligatori mancanti' });
    }

    // Verifica che la richiesta esista
    const request = await copiesModel.getRequestById(parseInt(requestId));
    if (!request) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ error: 'Questa richiesta è già stata processata' });
    }

    //Recupera il titolo del libro e il bibliotecario che ha fatto la richiesta
    const book = await BooksModel.getBookById(book_id);
    const librarian = await UserModel.getUserById(request.librarian_id);

    // Aggiunge copie in biblioteca
    const copiesAdded = await libraryBooksModel.addCopiesToLibrary(library_id, book_id, requested_copies);
    if (copiesAdded === 0) {
      return res.status(400).json({ error: 'Impossibile aggiungere le copie' });
    }

    //ottiene le copie disponibili dopo averle aggiunte
    const availableCopies = await libraryBooksModel.checkAvailability(library_id, book_id);

    //prende le prenotazioni soltanto per il numero di copie disponibili
    const reservations = await reservationModel.getReservationsByBookAndLibrary(
      book_id, 
      library_id, 
      availableCopies //limita al numero di copie disponibili
    );

    let processedReservations = 0;
    let copiesToProcess = availableCopies;
  
    const userNotifications = [];

    for (const reservation of reservations) {
      // Se non ci sono più copie disponibili, stoppa
      if (copiesToProcess <= 0) {
        break;
      }

      // Crea prestito automatico da prenotazione
      await loanModel.createLoanRequest(
        reservation.user_id,
        book_id,
        library_id
      );

      // Elimina la prenotazione
      await reservationModel.deleteReservation(reservation.id);

      userNotifications.push({
        recipient_id: reservation.user_id,
        recipient_role: 'user',
        title: 'Prenotazione Convertita in Prestito',
        message: `La tua prenotazione del libro "${book.title}" è stata convertita in prestito attivo. Hai 30 giorni per leggerlo.`,
        type: 'reservation_to_loan',
      });

      processedReservations++;
      copiesToProcess--; // Decrementa il contatore locale
    }

    // Aggiorna stato a approved
    const confirmed = await copiesModel.updateRequestStatus(parseInt(requestId), 'approved');
    if (confirmed === 0) {
      return res.status(400).json({ error: 'Impossibile rifiutare la richiesta' });
    }

    // NOTIFICA AL BIBLIOTECARIO
    await NotificationsModel.createNotification({
      recipient_id: librarian.id,
      recipient_role: 'librarian',
      title: 'Richiesta di Copie Approvata',
      message: `La tua richiesta di ${requested_copies} copie del libro "${book.title}" è stata approvata e le copie sono state aggiunte.`,
      type: 'copy_request_approved',
    });
    // NOTIFICHE AGLI UTENTI (in batch)
    for (const notification of userNotifications) {
      await NotificationsModel.createNotification(notification);
    }

    res.json({ message: 'Richiesta approvata e copie aggiunte con successo', requestId, processedReservations});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Rifiuta richiesta di copie (admin)
export async function rejectCopyRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ error: 'requestId obbligatorio' });
    }

    // Verifica che la richiesta esista
    const request = await copiesModel.getRequestById(parseInt(requestId));
    if (!request) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ error: 'Questa richiesta è già stata processata' });
    }

    // Recupera il titolo del libro e il bibliotecario
    const book = await BooksModel.getBookById(request.book_id);
    const librarian = await UserModel.getUserById(request.librarian_id);

    // Aggiorna stato a Rejected
    const reject = await copiesModel.updateRequestStatus(parseInt(requestId), 'Rejected');
    if (reject === 0) {
      return res.status(400).json({ error: 'Impossibile rifiutare la richiesta' });
    }

    // NOTIFICA AL BIBLIOTECARIO
    await NotificationsModel.createNotification({
      recipient_id: librarian.id,
      recipient_role: 'librarian',
      title: 'Richiesta di Copie Rifiutata',
      message: `Purtroppo la tua richiesta di copie del libro "${book.title}" è stata rifiutata dall'amministratore.`,
      type: 'copy_request_rejected',
    });

    res.json({ message: 'Richiesta rifiutata' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
