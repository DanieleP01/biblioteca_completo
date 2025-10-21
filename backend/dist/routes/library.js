import { Router } from 'express';
import { getLibraries } from '../controllers/libraryController.js';
const router = Router();
router.get('/', getLibraries);
export default router;
//# sourceMappingURL=library.js.map