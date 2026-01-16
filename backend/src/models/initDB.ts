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
      { firstName: 'Antonio', lastName: 'Verdi', username: 'biblio3', email: 'antonio@biblioteca.it' }
    ];

    for (const librarian of librarians) {
      await db.run(
        `INSERT OR IGNORE INTO users (firstName, lastName, username, email, password, city, province, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [librarian.firstName, librarian.lastName, librarian.username, librarian.email, librarianPasswordHash, 'Palermo', 'PA', 'librarian']
      );
    }
    console.log(`${librarians.length} bibliotecari creati (password: biblio1234)`);

    //ASSEGNA i bibliotecari come manager alle prime 3 biblioteche
    const librarianIds = await db.all(`SELECT id FROM users WHERE role = 'librarian' ORDER BY id`);
    
    for (let i = 0; i < Math.min(3, librarianIds.length); i++) {
      await db.run(
        `UPDATE libraries SET manager_id = ? WHERE id = ?`,
        [librarianIds[i].id, i + 1]
      );
    }

  } catch (error) {
    console.error('Errore nella popolazione dei dati:', error);
    throw error;
  }
}

initDB();