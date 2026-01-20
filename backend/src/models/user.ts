import { openDb } from './db.js';
import bcrypt from 'bcrypt';

// Crea utente
export async function createUser(firstName: string, lastName: string, username: string, email: string, passwordHash: string, city: string, province: string) {
  const db = await openDb();

  await db.run(
    'INSERT INTO users (firstName, lastName, username, email, password, city, province) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [firstName, lastName, username, email, passwordHash, city || null, province || null]
  );
  await db.close();
}

//Recupera Utente per username o email
export async function getUserByUsernameOrEmail(identifier: string){
  const db = await openDb();
  
  const user = await db.get(
    `SELECT 
          u.*, 
          CASE 
              WHEN u.role = 'librarian' THEN l.id 
              ELSE NULL 
          END AS library_id
      FROM 
          users u 
      LEFT JOIN 
          libraries l ON u.id = l.librarian_id 
      WHERE 
          u.username = ? OR u.email = ?`,
    [identifier, identifier]
  );
  await db.close();
  return user;
}

//Recupera dati per id
export async function getUserById(identifier: number){
  const db = await openDb();
  
  const user = await db.get(
    `SELECT 
          u.*, 
          CASE 
              WHEN u.role = 'librarian' THEN l.name 
              ELSE NULL 
          END AS library_name,
          CASE 
              WHEN u.role = 'librarian' THEN l.address 
              ELSE NULL 
          END AS library_address
    FROM 
        users u 
    LEFT JOIN 
        libraries l ON u.id = l.librarian_id 
    WHERE 
        u.id = ?`,
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

//ritorna l'id dell'amministratore (è unico)
export async function getAdminId(){
  const db = await openDb();

  const result = await db.get(`SELECT id FROM users WHERE role = 'admin'`);

  await db.close();
  return result ? result.id : null;
}