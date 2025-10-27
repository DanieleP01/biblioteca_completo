import { Request, Response } from 'express';
import * as LibraryBooksModel from '../models/libraryBooks.js';

// Ottieni libri di una biblioteca
export async function getBooksByLibrary(req: Request, res: Response) {
    try {
        const { libraryId } = req.params;
        
        if (!libraryId) {
            return res.status(400).json({ error: 'libraryId è obbligatorio' });
        }
        
        const books = await LibraryBooksModel.getBooksByLibrary(parseInt(libraryId));
        res.json(books);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Ottieni biblioteche che hanno un libro
export async function getLibrariesByBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'bookId è obbligatorio' });
        }
        
        const libraries = await LibraryBooksModel.getLibrariesByBook(parseInt(bookId));
        res.json(libraries);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Verifica disponibilità
export async function checkAvailability(req: Request, res: Response) {
    try {
        const { libraryId, bookId } = req.params;
        
        if (!libraryId || !bookId) {
            return res.status(400).json({ error: 'libraryId e bookId sono obbligatori' });
        }
        
        const copies = await LibraryBooksModel.checkAvailability(
            parseInt(libraryId),
            parseInt(bookId)
        );
        
        res.json({ 
            library_id: parseInt(libraryId),
            book_id: parseInt(bookId),
            available_copies: copies,
            is_available: copies > 0
        });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Aggiungi libro a biblioteca
export async function addBookToLibrary(req: Request, res: Response) {
    try {
        const { library_id, book_id, copies } = req.body;
        
        if (!library_id || !book_id || !copies) {
            return res.status(400).json({
                error: 'library_id, book_id e copies sono obbligatori'
            });
        }
        
        if (copies < 1) {
            return res.status(400).json({
                error: 'Il numero di copie deve essere almeno 1'
            });
        }
        
        await LibraryBooksModel.addBookToLibrary(library_id, book_id, copies);
        
        res.status(201).json({
            message: 'Libro aggiunto alla biblioteca con successo',
            library_id,
            book_id,
            copies
        });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Aggiorna copie
export async function updateCopies(req: Request, res: Response) {
    try {
        const { library_id, book_id, copies } = req.body;
        
        if (!library_id || !book_id || copies === undefined) {
            return res.status(400).json({
                error: 'library_id, book_id e copies sono obbligatori'
            });
        }
        
        const changes = await LibraryBooksModel.updateCopies(library_id, book_id, copies);
        
        if (changes === 0) {
            return res.status(404).json({
                error: 'Associazione libro-biblioteca non trovata'
            });
        }
        
        res.json({
            message: 'Numero copie aggiornato',
            copies
        });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Rimuovi libro da biblioteca
export async function removeBookFromLibrary(req: Request, res: Response) {
    try {
        const { library_id, book_id } = req.body;
        
        if (!library_id || !book_id) {
            return res.status(400).json({
                error: 'library_id e book_id sono obbligatori'
            });
        }
        
        const changes = await LibraryBooksModel.removeBookFromLibrary(library_id, book_id);
        
        if (changes === 0) {
            return res.status(404).json({
                error: 'Associazione non trovata'
            });
        }
        
        res.json({ message: 'Libro rimosso dalla biblioteca' });
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// Ottieni tutte le associazioni
export async function getAllLibraryBooks(req: Request, res: Response) {
    try {
        const associations = await LibraryBooksModel.getAllLibraryBooks();
        res.json(associations);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
