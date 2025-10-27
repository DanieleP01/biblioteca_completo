import { openDb } from './db.js';
import fs from 'fs';

async function initDB() {
  const dbFile = './database/biblioteca.db';
  const schemaFile = './src/models/schema.sql';

  // Leggi lo schema SQL
  const schema = fs.readFileSync(schemaFile, 'utf-8');

  // Apri/crea il database
  const db = await openDb();

  // Esegui lo script SQL
  await db.exec(schema);

  await db.close();
  console.log('Database creato e inizializzato!');
}

initDB();