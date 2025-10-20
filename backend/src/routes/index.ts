import { Router } from 'express';
import { getBooks } from '../controllers/booksController.js';
const router = Router();

router.get('/libri', getBooks);
//router.get('/libri', getBooks);

export { router };