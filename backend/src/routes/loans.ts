import { Router } from 'express';
import * as LoanController from '../controllers/loansController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = Router();

// Richiesta prestito
router.post('/loans/request', LoanController.requestLoan);

// Richieste in attesa
router.get('/libraries/:libraryId/pending-loans', LoanController.getPendingLoans);

// Prestiti attivi biblioteca
router.get('/libraries/:libraryId/active-loans', LoanController.getActiveLoansLibrary);

// Prestiti in scadenza
router.get('/libraries/:libraryId/expiring-loans', LoanController.getExpiringLoans);

// Prestiti scaduti
router.get('/libraries/:libraryId/overdue-loans', LoanController.getOverdueLoans);

// Aggiorna prestiti scaduti
router.put('/loans/update-overdue', LoanController.updateOverdueLoans);

// Approva prestito
router.patch('/loans/:loanId/approve', LoanController.approveLoan);

// Rifiuta prestito
router.patch('/loans/:loanId/reject', LoanController.rejectLoan);

// Restituisci libro
router.patch('/loans/:loanId/return', LoanController.returnBook);

// Prestiti utente
router.get('/users/:userId/loans', LoanController.getUserLoans);

// Prestiti attivi utente
router.get('/users/:userId/active-loans', LoanController.getActiveLoansUsers);

// Controllo prestito attivo utente per libro specifico
router.get('/users/:userId/active-loan/:bookId', LoanController.checkActiveLoan);

export default router;
