import { openDb } from './db.js';

// Crea una nuova prenotazione
export async function createReservation(userId: number, bookId: number, libraryId: number) {
  
  const reservationDate = new Date().toISOString();
  const status = 'pending';
  
  const db = await openDb(); 

  try {
    const result = await db.run(
        `INSERT INTO reservations 
            (user_id, 
            book_id, 
            library_id, 
            reservation_date, 
            status)
        VALUES (?, ?, ?, ?, ?)`
        , userId, bookId, libraryId, reservationDate, status);
    
    // Controllo di sicurezza migliorato
    if (!result || typeof result.lastID === 'undefined') {
      throw new Error("Inserimento fallito, nessun ID restituito.");
    }

    return {
      id: result.lastID,
      user_id: userId,
      library_id: libraryId,
      book_id: bookId,
      reservation_date: reservationDate,
      status: 'pending'
    };

  } catch (error) {
    console.error("Errore SQL in createReservation:", error);
    throw error;
  } finally {
    await db.close(); // Chiude la connessione
  }
}

// Cerca una prenotazione pendente per lo stesso utente, libro e biblioteca.
export async function findPendingReservation(userId: number, bookId: number, libraryId: number) {
  const sql = `
    SELECT * FROM reservations
    WHERE user_id = ? AND book_id = ? AND library_id = ? AND status = 'pending'
  `;
  
  const db = await openDb(); // Apre la connessione

  try {
    // Esegue db.get come nel tuo pattern
    const reservation = await db.get(
        `SELECT * FROM reservations
        WHERE user_id = ? AND book_id = ? AND library_id = ? AND status = 'pending'`
        , userId, bookId, libraryId);

    return reservation || null;
  } catch (error) {
    console.error("Errore SQL in findPendingReservation:", error);
    throw error;
  } finally {
    await db.close(); // Chiude la connessione
  }
}
