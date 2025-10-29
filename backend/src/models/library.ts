import { openDb } from './db.js';

export async function getAllLibraries() {
  const db = await openDb();
  
  const libraries = await db.all('SELECT * FROM libraries');
  await db.close();
  return libraries;
}

export async function getLibraryById(id: number) {
    const db = await openDb();

    const library = await db.get('SELECT * FROM libraries WHERE id = ?', id);
    await db.close();
    return library;
}

export async function getLibraryByManagerId(managerId: number) {
  const db = await openDb();
  
  const library = await db.get(
    'SELECT * FROM libraries WHERE manager_id = ?',
    managerId
  );
  
  await db.close();
  return library;
}