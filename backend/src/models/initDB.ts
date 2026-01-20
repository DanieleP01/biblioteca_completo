import { openDb } from './db.js';
import fs from 'fs';
import bcrypt from 'bcrypt';

async function initDB() {

  const dbFile = './database/biblioteca.db';
  const schemaFile = './src/models/schema.sql';

  // Leggi lo schema SQL
  const schema = fs.readFileSync(schemaFile, 'utf-8');

  // Apri/crea il database
  const db = await openDb();

  // Esegui lo script SQL
  await db.exec(schema);

  //esegue il popolamento dell'amministratore e degli utenti
  await populateInitialUsers(db);

  await db.close();
  console.log('Database creato e inizializzato!');
}

async function populateInitialUsers(db: any) {
  try {
    const SALT_ROUNDS = 10;

    //CREA ADMIN (password in chiaro: "admin1234")
    const adminPasswordHash = await bcrypt.hash('admin1234', SALT_ROUNDS);
    await db.run(
      `INSERT OR IGNORE INTO users (firstName, lastName, username, email, password, city, province, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Admin', 'Admin', 'admin', 'admin@biblioteca.it', adminPasswordHash, 'Palermo', 'PA', 'admin']
    );
    console.log('1 Admin creato (password: admin1234)');

    // CREA BIBLIOTECARI (password in chiaro: "biblio1234")
    const librarianPasswordHash = await bcrypt.hash('biblio1234', SALT_ROUNDS);
    const librarians = [
      { firstName: 'Marco', lastName: 'Rossi', username: 'biblio1', email: 'marco@biblioteca.it' },
      { firstName: 'Giulia', lastName: 'Bianchi', username: 'biblio2', email: 'giulia@biblioteca.it' },
      { firstName: 'Antonio', lastName: 'Verdi', username: 'biblio3', email: 'antonio@biblioteca.it' },
      { firstName: 'Roberto', lastName: 'Mollica', username: 'biblio4', email: 'roberto@biblioteca.it' },
      { firstName: 'Daniele', lastName: 'Patti', username: 'biblio5', email: 'daniele@biblioteca.it' },
      { firstName: 'Francesca', lastName: 'Filippone', username: 'biblio6', email: 'francesca@biblioteca.it' },
      { firstName: 'Giulia', lastName: 'Rossi', username: 'biblio7', email: 'giulia@biblioteca.it' },
      { firstName: 'Michelle', lastName: 'Bianchi', username: 'biblio8', email: 'michelle@biblioteca.it' }
    ];

    for (const librarian of librarians) {
      await db.run(
        `INSERT OR IGNORE INTO users (firstName, lastName, username, email, password, city, province, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [librarian.firstName, librarian.lastName, librarian.username, librarian.email, librarianPasswordHash, 'Palermo', 'PA', 'librarian']
      );
    }
    console.log(`${librarians.length} bibliotecari creati (password: biblio1234)`);

    //ASSEGNA i bibliotecari alle prime 3 biblioteche
    const librarianIds = await db.all(`SELECT id FROM users WHERE role = 'librarian' ORDER BY id`);
    const libraries = await db.all(`SELECT id FROM libraries ORDER BY id`)
    const limit = Math.min(libraries.length, librarians.length);
    for(let i=0; i < limit; i++){
      await db.run(
        `UPDATE libraries SET librarian_id = ? WHERE id = ?`,
        [librarianIds[i].id, libraries[i].id]
      );
    }

    //POPOLAMENTO TABELLA library_books (assegnazione libri a biblioteche)
    const books = await db.all(`SELECT id FROM users ORDER BY id`);
    const libraryBooksData = [
      // Biblioteca 1 (indice 0)
      { libIndex: 0, bookIndex: 0, copies: 1 }, 
      { libIndex: 0, bookIndex: 1, copies: 3 }, 
      { libIndex: 0, bookIndex: 2, copies: 4 }, 

      // Biblioteca 2 (indice 1)
      { libIndex: 1, bookIndex: 3, copies: 2 },
      { libIndex: 1, bookIndex: 4, copies: 6 }, 

      // Biblioteca 3 (indice 2)
      { libIndex: 2, bookIndex: 5, copies: 1 }, 
      { libIndex: 2, bookIndex: 6, copies: 2 }, 

      // Biblioteca 4 (indice 3)
      { libIndex: 3, bookIndex: 7, copies: 3 },
      { libIndex: 3, bookIndex: 8, copies: 4 },

      // Biblioteca 5 (indice 4)
      { libIndex: 4, bookIndex: 9, copies: 5 },
      { libIndex: 4, bookIndex: 10, copies: 2 },

      // Biblioteca 6 (indice 5)
      { libIndex: 5, bookIndex: 11, copies: 3 },
      { libIndex: 5, bookIndex: 12, copies: 4 },

      // Biblioteca 7 (indice 6) 
      { libIndex: 6, bookIndex: 13, copies: 1 },
      { libIndex: 6, bookIndex: 0,  copies: 2 },

      // Biblioteca 8 (indice 7)
      { libIndex: 7, bookIndex: 1, copies: 3 },
      { libIndex: 7, bookIndex: 2, copies: 4 },

      // Biblioteca 9 (indice 8)
      { libIndex: 8, bookIndex: 3, copies: 5 },
      { libIndex: 8, bookIndex: 4, copies: 2 },

      // Biblioteca 10 (indice 9)
      { libIndex: 9, bookIndex: 5, copies: 3 },
      { libIndex: 9, bookIndex: 6, copies: 4 },
    ];

    for(const item of libraryBooksData){
      //controllo di sicurezza
      const library = libraries[item.libIndex];
      const book = books[item.bookIndex];
      
      if(library && books){
        await db.run(
          `INSERT OR IGNORE INTO library_books
          (library_id, book_id, total_copies, available_copies)
          VALUES (?, ?, ?, ?)`,
          [library.id, book.id, item.copies, item.copies]
        );
      }
    }
  } catch (error) {
    console.error('Errore nella popolazione dei dati:', error);
    throw error;
  }
}

initDB();