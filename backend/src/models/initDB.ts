import { openDb } from './db.js';
import fs from 'fs';
import * as path from 'path';  //debug (per capire il percorso del db che sta utilizzando)

async function initDB() {
  const dbFile = './database/biblioteca.db';
  const schemaFile = './src/models/schema.sql';

  // Leggi lo schema SQL
  const schema = fs.readFileSync(schemaFile, 'utf-8');

  // Apri/crea il database
  const db = await openDb();

  // Esegui lo script SQL
  await db.exec(schema);

  //mostra il percorsa del database che sta utilizzando
  const absolutePath = path.resolve(dbFile);
  console.log(`[DEBUG] Il database si trova qui: ${absolutePath}`);

  await db.close();
  console.log('Database creato e inizializzato!');
}

initDB();