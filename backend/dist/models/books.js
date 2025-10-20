var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
export function getAllBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield open({
            filename: './database/biblioteca.db',
            driver: sqlite3.Database
        });
        const books = yield db.all('SELECT * FROM books');
        yield db.close();
        return books;
    });
}
export function getBookById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield open({
            filename: './database/biblioteca.db',
            driver: sqlite3.Database
        });
        const book = yield db.get('SELECT * FROM books WHERE id = ?', id);
        yield db.close();
        return book;
    });
}
//# sourceMappingURL=books.js.map