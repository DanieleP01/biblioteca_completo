import { Router } from 'express';
import * as booksController from '../controllers/booksController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

//route per tutti i libri
router.get('/', booksController.getBooksController); 

//recupera il contenuto del libro dal file
router.get("/:content_path/content", booksController.getBookContentFromFile);

//route per il singolo libro
router.get('/:id', booksController.getBookByIdController); 

//rimuove libri
router.delete('/delete', booksController.deleteBooks);

export default router;