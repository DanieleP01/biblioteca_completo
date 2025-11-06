import { Router } from 'express';
import userRouter from './routes/user.js';
import booksRouter from './routes/books.js';
import libraryRouter from './routes/library.js';
import searchRouter from './routes/search.js';
import libraryBooksRoutes from './routes/libraryBooks.js';
import loanRoutes from './routes/loans.js';
import reservationRoutes from './routes/reservation.js';
import copiesRoutes from './routes/copies.js';

const router = Router();

router.use('/libri', booksRouter);
router.use('/librerie', libraryRouter);
router.use('/', userRouter);
router.use('/search', searchRouter);
router.use('/', libraryBooksRoutes);
router.use('/', loanRoutes);
router.use('/', reservationRoutes);
router.use('/', copiesRoutes);

export { router };