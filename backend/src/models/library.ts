import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getAllLibraries() {
  const db = await open({
    filename: './database/biblioteca.db',
    driver: sqlite3.Database
  });
  
  const libraries = await db.all('SELECT * FROM libraries');
  await db.close();
  return libraries;
}

export async function getLibraryById(id: number) {
    const db = await open({
        filename: './database/biblioteca.db',
        driver: sqlite3.Database
    });
    const library = await db.get('SELECT * FROM libraries WHERE id = ?', id);
    await db.close();
    return library;
}