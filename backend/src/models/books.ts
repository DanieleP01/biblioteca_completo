import { openDb } from './db.js';

export async function getAllBooks() {
  const db = await openDb();
  
  const books = await db.all('SELECT * FROM books');
  await db.close();
  return books;
}

export async function getBookById(id: number) {

    const db = await openDb();
  
    const book = await db.get('SELECT * FROM books WHERE id = ?', id);
    await db.close();
    return book;
}