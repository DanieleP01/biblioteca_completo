import { openDb } from './db.js';

//crea una nuova richiesta di copie
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

//Recupera le richieste
export async function getRequestCopies(){
  const db = await openDb();

  const requestCopies = await db.all(`
    SELECT 
        cr.id,
        cr.book_id,
        cr.library_id,
        cr.librarian_id,
        cr.requested_copies,
        cr.reason,
        cr.status,
        cr.created_at,
        cr.updated_at,
        b.title AS book_title,
        lib.name AS library_name,
        u.username AS librarian_name
    FROM CopyRequests cr
    JOIN books b ON cr.book_id = b.id
    JOIN libraries lib ON cr.library_id = lib.id
    JOIN users u ON cr.librarian_id = u.id
    WHERE cr.status = 'Pending'
    ORDER BY cr.created_at DESC`);

  await db.close();
  return requestCopies;
}

// Ottiene richiesta per ID
export async function getRequestById(requestId: number) {
  const db = await openDb();

  const request = await db.get(`
    SELECT * FROM CopyRequests WHERE id = ?
  `, requestId);

  await db.close();
  return request;
}

// Aggiorna stato richiesta
export async function updateRequestStatus(requestId: number, status: string) {
  const db = await openDb();

  const result = await db.run(`
    UPDATE CopyRequests 
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `, status, requestId);

  await db.close();
  return result.changes;
}



