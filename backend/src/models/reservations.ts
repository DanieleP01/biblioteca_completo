import { openDb } from './db.js';

// Crea una nuova prenotazione
export async function createReservation(userId: number, bookId: number, libraryId: number) {
  
  const reservationDate = new Date().toISOString();
  const status = 'pending';
  const db = await openDb();

  const result = await db.run(
    `INSERT INTO reservations 
        (user_id, 
        book_id, 
        library_id, 
        reservation_date, 
        status)
    VALUES (?, ?, ?, ?, ?)`
    , userId, bookId, libraryId, reservationDate, status);

  await db.close(); // Chiude la connessione
  return {
    id: result.lastID,
    user_id: userId,
    library_id: libraryId,
    book_id: bookId,
    reservation_date: reservationDate,
    status: 'pending'
  };
}

// Cerca una prenotazione in attesa per lo stesso utente, libro e biblioteca.
export async function findUserPendingReservation(userId: number, bookId: number, libraryId: number) {
  
  const db = await openDb(); 

  const reservation = await db.get(
    `SELECT * FROM reservations
    WHERE user_id = ? AND book_id = ? AND library_id = ? AND status = 'pending'`
    , userId, bookId, libraryId);

  await db.close(); 
  return reservation || null;
}

// Elimina una prenotazione
export async function deleteReservation(reservationId: number) {
  const db = await openDb();

  const result = await db.run(
    `DELETE FROM reservations WHERE id = ?`,
    [reservationId]
  );

  await db.close();
  return result.changes;
}


// Cerca Prenotazioni per una specifica biblioteca e uno specifico libro (più utenti)
export async function findReservationsByLibraryAndBook(libraryId: number, bookId: number) {
  const db = await openDb(); 

  const reservations = await db.all(
    `SELECT 
          reservations.*,
          users.username
    FROM reservations
    JOIN users ON reservations.user_id = users.id
    WHERE library_id = ? AND book_id = ?
    ORDER BY reservation_date ASC`
    , libraryId, bookId);

  await db.close(); 
  return reservations || [];
}

//Recupera prenotazioni da un libro e bibioteca specifico
export async function getReservationsByBookAndLibrary(bookId: number, libraryId: number, limit: number){
  const db = await openDb();

  const reservations = await db.all(
    `SELECT *
    FROM reservations
    WHERE book_id = ? AND library_id = ? AND status = 'pending'
    ORDER BY reservation_date ASC
    LIMIT ?`
    , bookId, libraryId, limit);

  await db.close();
  return reservations;
}



