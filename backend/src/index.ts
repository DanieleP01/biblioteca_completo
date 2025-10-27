import { Router } from 'express';
import userRouter from './routes/user.js';
import booksRouter from './routes/books.js';
import libraryRouter from './routes/library.js';
import searchRouter from './routes/search.js';
import libraryBooksRoutes from './routes/libraryBooks.js';
import loanRoutes from './routes/loans.js';

const router = Router();

router.use('/libri', booksRouter);
router.use('/librerie', libraryRouter);
router.use('/', userRouter);
router.use('/search', searchRouter);
router.use('/library-books', libraryBooksRoutes);
router.use('/loans', loanRoutes);

export { router };

/* router.get('/libri', getBooksController);
router.get('/librerie', getLibrariesController);
router.get('/libri/:id', getBookByIdController);
router.get('/librerie/:id', getLibraryByIdController); */