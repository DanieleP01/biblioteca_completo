import { Request, Response } from 'express';
import * as LoanModel from '../models/loans.js';
import * as LibraryBooksModel from '../models/libraryBooks.js';
import * as ReservationModel from '../models/reservations.js';
import * as BooksModel from '../models/books.js';
import * as UserModel from '../models/user.js';
import * as NotificationsModel from '../models/notifications.js';
import * as LibraryModel from '../models/library.js';

// Richiesta prestito da parte dell'utente
export async function requestLoan(req: Request, res: Response) {
    try {
        const { user_id, book_id, library_id } = req.body;
        
        // Validazione
        if (!user_id || !book_id || !library_id) {
            return res.status(400).json({
                error: 'user_id, book_id e library_id sono obbligatori'
            });
        }
        
        //Verifica disponibilità copie
        const availableCopies = await LibraryBooksModel.checkAvailability(library_id, book_id);
        if (availableCopies < 1) {
            return res.status(400).json({
                error: 'Nessuna copia disponibile in questa biblioteca'
            });
        }
        
        // Verifica prestito duplicato
        const hasDuplicate = await LoanModel.checkDuplicateLoan(user_id, book_id);
        if (hasDuplicate) {
            return res.status(400).json({
                error: 'Hai già una richiesta o un prestito attivo per questo libro'
            });
        }
        
        //Crea richiesta
        const loanId = await LoanModel.createLoanRequest(user_id, book_id, library_id);

        // NOTIFICA AL BIBLIOTECARIO
        const book = await BooksModel.getBookById(book_id); 
        const library = await LibraryModel.getLibraryById(library_id);
        
        if (library && library.librarian_id) {
            await NotificationsModel.createNotification({
                recipient_id: library.librarian_id,
                recipient_role: 'librarian',
                title: 'Nuova Richiesta di Prestito',
                message: `Un utente ha richiesto il libro "${book.title}". Accetta o rifiuta la richiesta.`,
                type: 'loan_request_created',
            });
        }
        res.status(201).json({
            message: 'Richiesta di prestito inviata con successo',
            loan_id: loanId
        });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Recupera richieste in attesa (bibliotecario)
export async function getPendingLoans(req: Request, res: Response) {
    try {
        const { libraryId } = req.params;
        
        if (!libraryId) {
            return res.status(400).json({ error: 'libraryId è obbligatorio' });
        }
        
        const loans = await LoanModel.getPendingLoansByLibrary(parseInt(libraryId));
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Approva prestito (bibliotecario)
export async function approveLoan(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        
        if (!loanId) {
            return res.status(400).json({ error: 'loanId è obbligatorio' });
        }
        
        // Ottieni dettagli prestito
        const loan = await LoanModel.getLoanById(parseInt(loanId));
        if (!loan) {
            return res.status(404).json({ error: 'Prestito non trovato' });
        }
        
        if (loan.status !== 'pending') {
            return res.status(400).json({
                error: 'Questo prestito è già stato processato'
            });
        }
        
        // Approva prestito
        const changes = await LoanModel.approveLoan(parseInt(loanId));
        if (changes === 0) {
            return res.status(400).json({
                error: 'Impossibile approvare il prestito'
            });
        }
        
        // Decrementa copie disponibili
        await LibraryBooksModel.decrementCopies(loan.library_id, loan.book_id);
        
        res.json({
            message: 'Prestito approvato con successo',
            loan_id: loanId,
            due_date: loan.due_date
        });
        
        // NOTIFICA ALL'UTENTE - Prestito Approvato
        const book = await BooksModel.getBookById(loan.book_id);
        await NotificationsModel.createNotification({
            recipient_id: loan.user_id,
            recipient_role: 'user',
            title: 'Prestito Approvato',
            message: `La tua richiesta di prestito per il libro "${book.title}" è stata approvata! Hai 30 giorni per leggerlo.`,
            type: 'loan_approved',
        });

        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Rifiuta prestito (bibliotecario)
export async function rejectLoan(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        
        if (!loanId) {
            return res.status(400).json({ error: 'loanId è obbligatorio' });
        }
        
        //ottiene dettagli prestito
        const loan = await LoanModel.getLoanById(parseInt(loanId));
        if (!loan) {
            return res.status(404).json({ error: 'Prestito non trovato' });
        }
        
        if (loan.status !== 'pending') {
            return res.status(400).json({
                error: 'Questo prestito è già stato processato'
            });
        }
        
        //rifiuta il prestito
        const changes = await LoanModel.rejectLoan(parseInt(loanId));
        if (changes === 0) {
            return res.status(400).json({
                error: 'Impossibile rifiutare il prestito'
            });
        }

        // NOTIFICA ALL'UTENTE - Prestito Rifiutato
        const book = await BooksModel.getBookById(loan.book_id);
        await NotificationsModel.createNotification({
        recipient_id: loan.user_id,
        recipient_role: 'user',
        title: 'Prestito Rifiutato',
        message: `Purtroppo la tua richiesta di prestito per il libro "${book.title}" è stata rifiutata.`,
        type: 'loan_rejected',
        });
        
        res.json({ message: 'Prestito rifiutato' });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Restituisci libro (bibliotecario)
export async function returnBook(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        
        if (!loanId) {
            return res.status(400).json({ error: 'loanId è obbligatorio' });
        }
        
        //ottiene dettagli prestito
        const loan = await LoanModel.getLoanById(parseInt(loanId));
        if (!loan) {
            return res.status(404).json({ error: 'Prestito non trovato' });
        }
        
        if (loan.status !== 'active') {
            return res.status(400).json({
                error: 'Il prestito non è attivo'
            });
        }
        
        //cambia lo stato da 'active' a 'returned'
        const changes = await LoanModel.returnBook(parseInt(loanId));
        if (changes === 0) {
            return res.status(400).json({ error: 'Impossibile completare la restituzione'});
        }
        
        // Incrementa copie disponibili
        await LibraryBooksModel.incrementCopies(loan.library_id, loan.book_id);

         // NOTIFICA AL BIBLIOTECARIO
        const book = await BooksModel.getBookById(loan.book_id); 
        const library = await LibraryModel.getLibraryById(loan.library_id);
        const user = await UserModel.getUserById(loan.user_id);

        if (library && library.librarian_id) {
            await NotificationsModel.createNotification({
                recipient_id: library.librarian_id,
                recipient_role: 'librarian',
                title: 'Restituzione libro',
                message: `L'utente '${user.username}' ha restituito il libro "${book.title}".`,
                type: 'loan_request_created',
            });
        }

        // prende la prima prenotazione, dato che è stato reso disponibile il libro
        const reservation = await ReservationModel.getReservationsByBookAndLibrary(
            loan.book_id,
            loan.library_id,
            1  // Prende solo 1 prenotazione (la prima in coda)
        );

        //se c'è una prenotazione, crea la richiesta di prestito e elimina la prenotazione
        if(reservation && reservation.length > 0){
            const firstReservation = reservation[0];

            await LoanModel.createLoanRequest(
                firstReservation.user_id,
                loan.book_id,
                loan.library_id
            );
            await ReservationModel.deleteReservation(firstReservation.id);
            
            // NOTIFICA ALL'UTENTE IN PRENOTAZIONE
            await NotificationsModel.createNotification({
                recipient_id: firstReservation.user_id,
                recipient_role: 'user',
                title: 'Prenotazione Convertita in Prestito',
                message: `La tua prenotazione del libro "${book.title}" è stata convertita in prestito attivo! Hai 30 giorni per leggerlo.`,
                type: 'reservation_to_loan',
            });
        }

        res.json({ message: 'Libro restituito con successo' });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Aggiorna prestiti scaduti (chiamato manualmente o via scheduler)
export async function updateOverdueLoans(req: Request, res: Response) {
    try {
        const changes = await LoanModel.updateOverdueLoans();
        
        res.json({
            message: `${changes} prestiti aggiornati a 'overdue'`,
            updated_count: changes
        });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Recupera prestiti di un utente
export async function getUserLoans(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const { status } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId è obbligatorio' });
        }
        
        const loans = await LoanModel.getLoansByUser(
            parseInt(userId),
            status as string
        );
        
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Recupera prestiti attivi biblioteca
export async function getActiveLoansLibrary(req: Request, res: Response) {
    try {
        const { libraryId } = req.params;
        
        if (!libraryId) {
            return res.status(400).json({ error: 'libraryId è obbligatorio' });
        }
        
        const loans = await LoanModel.getActiveLoansByLibrary(parseInt(libraryId));
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Recupera prestiti attivi utente
export async function getActiveLoansUsers(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'userId è obbligatorio' });
        }

        const loans = await LoanModel.getActiveLoansByUser(parseInt(userId));
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//controlla se c'è un prestito attivo
export async function checkActiveLoan(req: Request, res: Response) {
  try {
    const { userId, bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(400).json({ error: 'userId e bookId sono obbligatori' });
    }

    const activeLoan = await LoanModel.getActiveLoanByUserAndBook(
      parseInt(userId),
      parseInt(bookId)
    );

    // Ritorna se esiste un prestito attivo
    res.json({
      hasActiveLoan: !!activeLoan,
      loan: activeLoan || null
    });

  } catch (error: any) {
    console.error('Errore verifica prestito attivo:', error);
    res.status(500).json({ error: error.message });
  }
}

//Recupera prestiti in scadenza
export async function getExpiringLoans(req: Request, res: Response) {
    try {
        const { libraryId } = req.params;
        
        if (!libraryId) {
            return res.status(400).json({ error: 'libraryId è obbligatorio' });
        }
        
        const loans = await LoanModel.getExpiringLoans(parseInt(libraryId));
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

//Recupera prestiti scaduti
export async function getOverdueLoans(req: Request, res: Response) {
    try {
        const { libraryId } = req.params;
        
        if (!libraryId) {
            return res.status(400).json({ error: 'libraryId è obbligatorio' });
        }
        
        // Aggiorna prima i prestiti scaduti
        await LoanModel.updateOverdueLoans();
        
        // Poi recupera i prestiti con stato 'overdue'
        const loans = await LoanModel.getOverdueLoans(parseInt(libraryId));
        res.json(loans);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
