var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllLibraries, getLibraryById } from '../models/library.js';
export function getLibraries(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const libraries = yield getAllLibraries();
            res.json(libraries);
        }
        catch (err) {
            res.status(500).json({ error: 'Errore nel recupero dei libri' });
        }
    });
}
export function getLibreriaById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const library = yield getLibraryById(id);
            if (library) {
                res.json(library);
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
//# sourceMappingURL=libraryController.js.map