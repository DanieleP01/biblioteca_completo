import { Router } from 'express';
import { getBooksController, getBookByIdController } from '../controllers/booksController.js';
import { getLibrariesController, getLibraryByIdController } from '../controllers/libraryController.js';
const router = Router();

router.get('/libri', getBooksController);
router.get('/librerie', getLibrariesController);
router.get('/libri/:id', getBookByIdController);
router.get('/librerie/:id', getLibraryByIdController);

export { router };