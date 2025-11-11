import { openDb } from './db.js';

//tutti i libri
export async function getAllBooks() {
  const db = await openDb();
  
  const books = await db.all('SELECT * FROM books');
  await db.close();
  return books;
}

//libro per id specifico
export async function getBookById(id: number) {

    const db = await openDb();
  
    const book = await db.get('SELECT * FROM books WHERE id = ?', id);
    await db.close();
    return book;
}

//crea un libro
export async function createBook(bookData: {
  title: string;
  author: string;
  isbn: string;
  category?: string;
  year?: number;
  description?: string;
  cover_url?: string;
  content: string;
  }){

  const db = await openDb();

  const result = await db.run(
    `INSERT INTO books (title, author, isbn, category, year, description, cover_url, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookData.title,
        bookData.author,
        bookData.isbn,
        bookData.category || null,
        bookData.year || new Date().getFullYear(),
        bookData.description || null,
        bookData.cover_url || null,
        bookData.content || null
      ]);

  await db.close();
  return result.lastID as number;
}

//rimuove libri da tutte le biblioteche associate
export async function deleteBooks(bookIds: number[]) {
  const db = await openDb();
  const placeholders = bookIds.map(() => '?').join(',');

  const result = await db.run(
    `DELETE FROM books WHERE id IN (${placeholders})`
    , bookIds );
  await db.close();
  return result.changes;
}

//FUNZIONI UTILIZZATE PER LE NOTIFICHE

// Recupera tutti i bibliotecari che avevano questo libro nelle loro biblioteche
export async function getLibrariansByBookId(bookId: number) {
  const db = await openDb();
  
  const librarians = await db.all(
    `SELECT DISTINCT u.id FROM users u
     WHERE u.role = 'librarian' AND u.library_id IN (
       SELECT library_id FROM book_library WHERE book_id = ?
     )`,
    bookId
  );
  
  await db.close();
  return librarians;
}

// Recupera tutti gli utenti che avevano questo libro in prestito
export async function getUsersByBookId(bookId: number) {
  const db = await openDb();

  const users = await db.all(
    `SELECT DISTINCT u.id FROM users u
      WHERE u.role = 'user' AND u.id IN (
        SELECT user_id FROM loans WHERE book_id = ? AND status = 'active'
      )`,
    bookId
  );

  await db.close();
  return users;
}

