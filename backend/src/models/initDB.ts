import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

async function initDB() {
  const dbFile = './database/biblioteca.db';
  const schemaFile = './src/models/schema.sql';

  // Leggi lo schema SQL
  const schema = fs.readFileSync(schemaFile, 'utf-8');

  // Apri/crea il database
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  // Esegui lo script SQL
  await db.exec(schema);

  await db.close();
  console.log('Database creato e inizializzato!');
}

initDB();