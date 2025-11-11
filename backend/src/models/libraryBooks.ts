import { openDb } from './db.js';

// Ottieni tutti i libri di una biblioteca specifica
export async function getBooksByLibrary(libraryId: number) {
    const db = await openDb();
    
    const books = await db.all(`
        SELECT 
            b.*,
            lb.total_copies,
            lb.available_copies,
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
            lb.total_copies,
            lb.available_copies,
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
        SELECT available_copies 
        FROM library_books 
        WHERE library_id = ? AND book_id = ?
    `, libraryId, bookId);

    await db.close();
    return result?.available_copies || 0;
}

// Aggiunge un nuovo libro con relative copie
export async function addBookToLibraries(
    bookId: number, 
    libraryAssociations: Array<{ libraryId: number; copies: number}>
): Promise<void> {
    
    const db = await openDb();
    for (const association of libraryAssociations) {
        // Validazione copie
        if (association.copies < 1) {
        throw new Error(`Numero di copie non valido per biblioteca ${association.libraryId}`);
        }

        // Inserisci nuovo record
        const result = await db.run(
            `INSERT INTO library_books (library_id, book_id, total_copies, available_copies)
            VALUES (?, ?, ?, ?)`,
            [
            association.libraryId,
            bookId,
            association.copies,
            association.copies
            ]
        );
    }

    await db.close();
}

// aggiunge copie di un libro in una biblioteca (usato quando l'admin accetta la richiesta di copie)
export async function addCopiesToLibrary(libraryId: number, bookId: number, copiesToAdd: number) {
  const db = await openDb();
  const result = await db.run(`
    UPDATE library_books 
    SET total_copies = total_copies + ?,
        available_copies = available_copies + ?
    WHERE library_id = ? AND book_id = ?
  `, copiesToAdd, copiesToAdd, libraryId, bookId);

  await db.close();
  return result.changes;
}

// Decrementa copie (usato quando si approva un prestito)
export async function decrementCopies(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE library_books 
        SET available_copies = available_copies - 1
        WHERE library_id = ? AND book_id = ? AND total_copies > 0
    `, libraryId, bookId);
    
    await db.close();
    return result.changes;
}

// Incrementa copie (usato quando si restituisce un libro)
export async function incrementCopies(libraryId: number, bookId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE library_books 
        SET available_copies = available_copies + 1
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

