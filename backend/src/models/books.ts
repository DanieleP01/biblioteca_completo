import { openDb } from './db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  content_path: string;
  }){

  const db = await openDb();

  const result = await db.run(
    `INSERT INTO books (title, author, isbn, category, year, description, cover_url, content_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookData.title,
        bookData.author,
        bookData.isbn,
        bookData.category || null,
        bookData.year || new Date().getFullYear(),
        bookData.description || null,
        bookData.cover_url || null,
        bookData.content_path || null
      ]);

  await db.close();
  return result.lastID as number;
}

//rimuove libri da tutte le biblioteche associate
export async function deleteBooks(bookIds: number[]) {
  const db = await openDb();
  const placeholders = bookIds.map(() => '?').join(',');

  // recupera i content_path dei libri da eliminare
  const pathToDelete = await db.all(
    `SELECT id, content_path FROM books WHERE id IN (${placeholders})`,
      bookIds
  );

  //elimina i file associati
  for (const book of pathToDelete) {
      if (book && book.content_path) {
        const filePath = path.resolve(__dirname, '../../storage/books', book.content_path);
        try {
          await fs.unlink(filePath);
          console.log(`File eliminato: ${book.content_path}`);
        } catch (err) {
          console.error(`Errore nell'eliminazione del file ${book.content_path}:`, err);
        }
      }
    }

  //elimina i libri dal db
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
    `SELECT DISTINCT l.manager_id as id 
     FROM libraries l
     INNER JOIN library_books lb ON l.id = lb.library_id
     WHERE lb.book_id = ?`,
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

//recupera i libri dal content_path (per l'upload del file)
export async function getBookByContentPath(contentPath: string) {
  const db = await openDb();
  const book = await db.get('SELECT * FROM books WHERE content_path = ?', contentPath);
  await db.close();
  return book;
}

