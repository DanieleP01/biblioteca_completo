import { openDb } from './db.js';

// Ottieni tutti i libri di una biblioteca specifica
export async function getBooksByLibrary(libraryId: number) {
    const db = await openDb();
    
    const books = await db.all(`
        SELECT 
            b.*,
            lb.copies,
            lb.library_id
        FROM books b
        INNER JOIN library_books lb ON b.id = lb.book_id
        WHERE lb.library_id = ?
        ORDER BY b.title
    `, libraryId);
    
    await db.close();
    return books;
}

// Ottieni tutte le biblioteche che hanno un libro specifico
export async function getLibrariesByBook(bookId: number) {
    const db = await openDb();
    
    const libraries = await db.all(`
        SELECT 
            l.*,
            lb.copies,
            lb.book_id
        FROM libraries l
        INNER JOIN library_books lb ON l.id = lb.library_id
        WHERE lb.book_id = ?
        ORDER BY l.name
    `, bookId);
    
    await db.close();
    return libraries;
}

// Verifica disponibilità copie per un libro in una biblioteca
export async function checkAvailability(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.get(`
        SELECT copies 
        FROM library_books 
        WHERE library_id = ? AND book_id = ?
    `, libraryId, bookId);
    
    await db.close();
    return result?.copies || 0;
}

// Aggiungi libro a biblioteca (o incrementa copie se già presente)
export async function addBookToLibrary(libraryId: number, bookId: number, copies: number) {
    const db = await openDb();
    
    await db.run(`
        INSERT INTO library_books (library_id, book_id, copies)
        VALUES (?, ?, ?)
        ON CONFLICT(library_id, book_id) 
        DO UPDATE SET copies = copies + excluded.copies
    `, libraryId, bookId, copies);
    
    await db.close();
}

// Aggiorna numero copie
export async function updateCopies(libraryId: number, bookId: number, copies: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE library_books 
        SET copies = ?
        WHERE library_id = ? AND book_id = ?
    `, copies, libraryId, bookId);
    
    await db.close();
    return result.changes;
}

// Decrementa copie (usato quando si approva un prestito)
export async function decrementCopies(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE library_books 
        SET copies = copies - 1
        WHERE library_id = ? AND book_id = ? AND copies > 0
    `, libraryId, bookId);
    
    await db.close();
    return result.changes;
}

// Incrementa copie (usato quando si restituisce un libro)
export async function incrementCopies(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE library_books 
        SET copies = copies + 1
        WHERE library_id = ? AND book_id = ?
    `, libraryId, bookId);
    
    await db.close();
    return result.changes;
}

// Rimuovi libro da biblioteca
export async function removeBookFromLibrary(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        DELETE FROM library_books 
        WHERE library_id = ? AND book_id = ?
    `, libraryId, bookId);
    
    await db.close();
    return result.changes;
}

// Ottieni tutte le associazioni libro-biblioteca
export async function getAllLibraryBooks() {
    const db = await openDb();
    
    const associations = await db.all(`
        SELECT 
            lb.*,
            b.title,
            b.author,
            l.name as library_name
        FROM library_books lb
        JOIN books b ON lb.book_id = b.id
        JOIN libraries l ON lb.library_id = l.id
        ORDER BY l.name, b.title
    `);
    
    await db.close();
    return associations;
}