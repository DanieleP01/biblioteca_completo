import { Router } from 'express';
import { getBooks } from '../controllers/booksController.js';
const router = Router();
router.get('/', getBooks);
export default router;
//# sourceMappingURL=books.js.map