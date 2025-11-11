import { Router } from 'express';
import userRouter from './routes/user.js';
import booksRouter from './routes/books.js';
import libraryRouter from './routes/library.js';
import searchRouter from './routes/search.js';
import libraryBooksRoutes from './routes/libraryBooks.js';
import loanRoutes from './routes/loans.js';
import reservationRoutes from './routes/reservation.js';
import copiesRoutes from './routes/copies.js';
import notificationsRoutes from './routes/notifications.js';

const router = Router();

router.use('/books', booksRouter);
router.use('/libraries', libraryRouter);
router.use('/', userRouter);
router.use('/search', searchRouter);
router.use('/', libraryBooksRoutes);
router.use('/', loanRoutes);
router.use('/', reservationRoutes);
router.use('/copy-requests', copiesRoutes);
router.use('/notifications', notificationsRoutes);

export { router };
