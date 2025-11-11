import { Router } from 'express';
import * as LibraryBooksController from '../controllers/libraryBooksController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ottieni libri di una biblioteca
router.get('/libraries/:libraryId/books', LibraryBooksController.getBooksByLibrary);

// Ottieni biblioteche con un libro
router.get('/books/:bookId/libraries', LibraryBooksController.getLibrariesByBook);

// Verifica disponibilità
router.get('/availability/:libraryId/:bookId', LibraryBooksController.checkAvailability);

// Aggiungi libro a biblioteca
router.post('/library-books/add', LibraryBooksController.addBookToLibrary);

// Ottieni tutte le associazioni
router.get('/library-books', LibraryBooksController.getAllLibraryBooks);

export default router;
