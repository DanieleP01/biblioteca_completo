import { Router } from 'express';
import userRouter from './routes/user.js';
import booksRouter from './routes/books.js';
import libraryRouter from './routes/library.js';
import searchRouter from './routes/search.js';

const router = Router();

router.use('/libri', booksRouter);
router.use('/librerie', libraryRouter);
router.use('/', userRouter);
router.use('/search', searchRouter);

export { router };

/* router.get('/libri', getBooksController);
router.get('/librerie', getLibrariesController);
router.get('/libri/:id', getBookByIdController);
router.get('/librerie/:id', getLibraryByIdController); */