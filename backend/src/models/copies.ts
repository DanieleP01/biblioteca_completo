import { openDb } from './db.js';

// Funzione per creare una nuova richiesta di copie
export async function requestCopy(bookId: number, libraryId: number, librarianId: number, requestedCopies: number, reason: string) {
  const db = await openDb();
  const result = await db.run(`
    INSERT INTO CopyRequests (book_id, library_id, librarian_id, requested_copies, reason, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'Pending', CURRENT_TIMESTAMP)`
    , bookId, libraryId, librarianId, requestedCopies, reason);
    console.log('Nuova richiesta di copie creata con ID:', result.lastID);
    await db.close();
  return result.lastID;
}

