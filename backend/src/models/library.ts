import { openDb } from './db.js';

//Recupera tutte le librerie
export async function getAllLibraries() {
  const db = await openDb();
  
  const libraries = await db.all('SELECT * FROM libraries');
  await db.close();
  return libraries;
}

//recupera una libreria per id
export async function getLibraryById(id: number) {
    const db = await openDb();

    const library = await db.get('SELECT * FROM libraries WHERE id = ?', id);
    await db.close();
    return library;
}

//recupera la libreria di un determinato bibliotecario
export async function getLibraryByLibrarianId(librarianId: number) {
  const db = await openDb();
  
  const library = await db.get(
    'SELECT * FROM libraries WHERE librarian_id = ?',
    librarianId
  );
  
  await db.close();
  return library;
}