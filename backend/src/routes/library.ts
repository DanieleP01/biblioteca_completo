import { Router } from 'express';
import { getLibrariesController, getLibraryByIdController, getLibraryByLibrarianIdController } from '../controllers/libraryController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

//Recupera biblioteche
router.get('/', getLibrariesController);

//recupera biblioteca da id
router.get('/:id', getLibraryByIdController);

//recupera biblioteca relativo a un bibliotecario
router.get('/librarian/:librarianId', getLibraryByLibrarianIdController);

export default router;