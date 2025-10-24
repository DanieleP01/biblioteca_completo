import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Crea utente: salva username univoco, email e password hashata
export async function createUser(username: string, email: string, passwordHash: string) {
  const db = await open({
    filename: './database/biblioteca.db',
    driver: sqlite3.Database
  });
  // Questa evita duplicati
  await db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
    [username, email, passwordHash]
  );
  await db.close();
}