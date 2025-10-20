import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getAllBooks() {
  const db = await open({
    filename: './database/biblioteca.db',
    driver: sqlite3.Database
  });
  const books = await db.all('SELECT * FROM books');
  await db.close();
  return books;
}

export async function getBookById(id: number) {
    const db = await open({
        filename: './database/biblioteca.db',
        driver: sqlite3.Database
    });
    const book = await db.get('SELECT * FROM books WHERE id = ?', id);
    await db.close();
    return book;
}