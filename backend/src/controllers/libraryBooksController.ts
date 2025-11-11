import { Request, Response } from 'express';
import * as LibraryBooksModel from '../models/libraryBooks.js';
import * as BooksModel from '../models/books.js';
import * as LibraryModel from '../models/library.js';
import * as NotificationsModel from '../models/notifications.js';

//Recupera libri di una biblioteca
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

//Recupera biblioteche che hanno un libro
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

//Verifica disponibilità
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

//Aggiungi libro a biblioteca
export async function addBookToLibrary(req: Request, res: Response) {
    try {
        const { book, libraryAssociations } = req.body;
        
        const existingBook = await BooksModel.getBookById(book.id);
        if (existingBook) {
            return res.status(409).json({ 
                error: `Libro con id ${book.id} esiste già nel sistema. Ricompilare il modulo con i dati corretti.`,
                existingBookId: existingBook.id
            });
        }

        // Crea il libro
        const bookId = await BooksModel.createBook(book);

        // Aggiungi il libro alle biblioteche
        await LibraryBooksModel.addBookToLibraries(bookId, libraryAssociations);

        // NOTIFICA AI BIBLIOTECARI
        for (const association of libraryAssociations) {
            const library = await LibraryModel.getLibraryById(association.libraryId);
            const bookData = await BooksModel.getBookById(bookId);

            if (library) {
                await NotificationsModel.createNotification({
                recipient_id: library.manager_id,
                recipient_role: 'librarian',
                title: 'Nuovo Libro Aggiunto',
                message: `Il libro "${bookData.title}" di ${bookData.author} è stato aggiunto alla tua biblioteca con ${association.copies} copie.`,
                type: 'book_added'
                });
        }
        }
        res.status(201).json({ 
        message: 'Libro creato e associato alle biblioteche con successo',
        bookId
        });
        
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ 
            error: 'Attenzione: il libro esiste già in una o più biblioteche. Ricompilare il modulo con i dati corretti.'
        });
        }

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
