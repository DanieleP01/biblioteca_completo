import { openDb } from './db.js';

// Crea nuova richiesta di prestito
export async function createLoanRequest(userId: number, bookId: number, libraryId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        INSERT INTO loans (user_id, book_id, library_id, loan_date, due_date, status)
        VALUES (?, ?, ?, datetime('now'), datetime('now', '+30 days'), 'pending')
    `, userId, bookId, libraryId);
    
    await db.close();
    return result.lastID;
}

// Verifica se utente ha già un prestito attivo per un libro
export async function checkDuplicateLoan(userId: number, bookId: number) {
    const db = await openDb();
    
    const loan = await db.get(`
        SELECT id FROM loans 
        WHERE user_id = ? AND book_id = ? 
        AND status IN ('pending', 'active')
    `, userId, bookId);
    
    await db.close();
    return loan !== undefined;
}

// Ottieni tutte le richieste in attesa per una biblioteca
export async function getPendingLoansByLibrary(libraryId: number) {
    const db = await openDb();
    
    const loans = await db.all(`
        SELECT 
            l.id as loan_id,
            l.loan_date,
            l.due_date,
            l.status,
            u.id as user_id,
            u.firstName,
            u.lastName,
            u.email,
            b.id as book_id,
            b.title,
            b.author,
            b.isbn,
            b.cover_url,
            lib.name as library_name
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN books b ON l.book_id = b.id
        JOIN libraries lib ON l.library_id = lib.id
        WHERE l.library_id = ? AND l.status = 'pending'
        ORDER BY l.loan_date ASC
    `, libraryId);
    
    await db.close();
    return loans;
}

// Ottieni dettagli di un prestito specifico
export async function getLoanById(loanId: number) {
    const db = await openDb();
    
    const loan = await db.get(`
        SELECT * FROM loans WHERE id = ?
    `, loanId);
    
    await db.close();
    return loan;
}

// Approva prestito
export async function approveLoan(loanId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE loans 
        SET status = 'active'
        WHERE id = ? AND status = 'pending'
    `, loanId);
    
    await db.close();
    return result.changes;
}

// Rifiuta prestito
export async function rejectLoan(loanId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE loans 
        SET status = 'rejected'
        WHERE id = ? AND status = 'pending'
    `, loanId);
    
    await db.close();
    return result.changes;
}

// Restituisci libro
export async function returnBook(loanId: number) {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE loans 
        SET status = 'returned',
            return_date = datetime('now')
        WHERE id = ? AND status = 'active'
    `, loanId);
    
    await db.close();
    return result.changes;
}

// Aggiorna prestiti scaduti
export async function updateOverdueLoans() {
    const db = await openDb();
    
    const result = await db.run(`
        UPDATE loans 
        SET status = 'overdue'
        WHERE status = 'active' 
        AND date(due_date) < datetime('now')
    `);
    
    await db.close();
    return result.changes;
}

// Ottieni tutti i prestiti di un utente
export async function getLoansByUser(userId: number, status?: string) {
    const db = await openDb();
    
    let query = `
        SELECT 
            l.*,
            b.title,
            b.author,
            b.cover_url,
            lib.name as library_name,
            lib.address as library_address
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN libraries lib ON l.library_id = lib.id
        WHERE l.user_id = ?
    `;
    
    const params: any[] = [userId];
    
    if (status) {
        query += ' AND l.status = ?';
        params.push(status);
    }
    
    query += ' ORDER BY l.loan_date DESC';
    
    const loans = await db.all(query, ...params);
    
    await db.close();
    return loans;
}

// Ottieni prestiti attivi per un utente
export async function getActiveLoansByUser(userId: number) {
    const db = await openDb();
    
    const loans = await db.all(`
        SELECT 
            l.*,
            b.title,
            b.author,
            b.isbn,
            b.cover_url,
            lib.name as library_name
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN libraries lib ON l.library_id = lib.id
        WHERE l.user_id = ? AND l.status = 'active'
        ORDER BY l.due_date ASC`, userId);

    await db.close();
    return loans;
}

// Ottieni prestito attivo per utente e libro specifico
export async function getActiveLoanByUserAndBook(userId: number, bookId: number) {
  const db = await openDb();

  const loan = await db.get(
    `SELECT * FROM loans 
     WHERE user_id = ? 
     AND book_id = ? 
     AND status = 'active'
     AND due_date > datetime('now')`,
    [userId, bookId]
  );

  await db.close();
  return loan;
}


// Ottieni prestiti attivi per una biblioteca
export async function getActiveLoansByLibrary(libraryId: number) {
    const db = await openDb();
    
    const loans = await db.all(`
        SELECT 
            l.*,
            u.firstName,
            u.lastName,
            u.email,
            b.title,
            b.author,
            b.isbn,
            b.cover_url
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN books b ON l.book_id = b.id
        WHERE l.library_id = ? AND l.status = 'active'
        ORDER BY l.due_date ASC
    `, libraryId);
    
    await db.close();
    return loans;
}

// Ottieni prestiti in scadenza (ultimi 3 giorni prima della scadenza)
export async function getExpiringLoans(libraryId: number) {
    const db = await openDb();
    
    const loans = await db.all(`
        SELECT 
            l.*,
            u.firstName,
            u.lastName,
            u.email,
            b.title,
            b.author
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN books b ON l.book_id = b.id
        WHERE l.library_id = ? 
        AND l.status = 'active'
        AND date(l.due_date) <= date('now', '+3 days')
        AND date(l.due_date) >= date('now')
        ORDER BY l.due_date ASC
    `, libraryId);
    
    await db.close();
    return loans;
}

// Ottieni prestiti scaduti
export async function getOverdueLoans(libraryId: number) {
    const db = await openDb();
    
    const loans = await db.all(`
        SELECT 
            l.*,
            u.firstName,
            u.lastName,
            u.email,
            b.title,
            b.author,
            julianday('now') - julianday(l.due_date) as days_overdue
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN books b ON l.book_id = b.id
        WHERE l.library_id = ? 
        AND l.status = 'overdue'
        ORDER BY l.due_date ASC
    `, libraryId);
    
    await db.close();
    return loans;
}

