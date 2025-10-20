var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllBooks, getBookById } from '../models/books.js';
export function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield getAllBooks();
            res.json(books);
        }
        catch (err) {
            res.status(500).json({ error: 'Errore nel recupero dei libri' });
        }
    });
}
export function getLibroById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const book = yield getBookById(id);
            if (book) {
                res.json(book);
            }
            else {
                res.status(404).json({ error: 'Libro non trovato' });
            }
        }
        catch (err) {
            res.status(500).json({ error: 'Errore nel recupero del libro' });
        }
    });
}
//# sourceMappingURL=booksController.js.map