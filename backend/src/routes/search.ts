import { Router } from 'express';
import { getSearchController } from '../controllers/searchController.js';

const router = Router();

router.get('/', getSearchController);

export default router;