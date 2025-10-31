import { openDb } from './db.js';
import bcrypt from 'bcrypt';

// Crea utente: salva username univoco, email e password hashata
export async function createUser(firstName: string, lastName: string, username: string, email: string, passwordHash: string, city: string, province: string) {
  const db = await openDb();

  // Questa evita duplicati
  await db.run(
    'INSERT INTO users (firstName, lastName, username, email, password, city, province) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [firstName, lastName, username, email, passwordHash, city || null, province || null]
  );
  await db.close();
}

//get Utente per username o email
export async function getUserByUsernameOrEmail(identifier: string){
  const db = await openDb();
  
  const user = await db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );
  await db.close();
  return user;
}

//get Utente per id
export async function getUserById(identifier: number){
  const db = await openDb();
  
  const user = await db.get(
    'SELECT * FROM users WHERE id = ?',
    [identifier]
  );
  await db.close();
  return user;
}

//hash della password
export async function hashPassword(password: string): Promise<string>{
  return bcrypt.hash(password, 10);
}

//verifica password
export async function verifyPassword(plainPassword: string, hashedPassword: string){
  return bcrypt.compare(plainPassword, hashedPassword);
}