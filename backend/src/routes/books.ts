import { Router } from 'express';
import { getBooksController, getBookByIdController } from '../controllers/booksController.js';

const router = Router();

router.get('/', getBooksController); //route per tutti i libri

router.get('/:id', getBookByIdController); //route per il singolo libro

export default router;