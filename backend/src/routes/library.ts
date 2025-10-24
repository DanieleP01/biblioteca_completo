import { Router } from 'express';
import { getLibrariesController, getLibraryByIdController } from '../controllers/libraryController.js';

const router = Router();

router.get('/', getLibrariesController);
router.get('/:id', getLibraryByIdController);

export default router;