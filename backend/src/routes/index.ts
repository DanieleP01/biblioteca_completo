import { Router } from 'express';
import { getBooks } from '../controllers/booksController.js';
import { getLibraries } from '../controllers/libraryController.js';
const router = Router();

router.get('/libri', getBooks);
router.get('/librerie', getLibraries);

export { router };