import { Router } from 'express';
import { getLibrariesController, getLibraryByIdController, getLibraryByManagerIdController } from '../controllers/libraryController.js';

const router = Router();

router.get('/', getLibrariesController);
router.get('/:id', getLibraryByIdController);
router.get('/manager/:managerId', getLibraryByManagerIdController);

export default router;