import { Request, Response } from 'express';
import { createUser, getUserById, getUserByUsernameOrEmail, verifyPassword } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// LOGIN
export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // identifier può essere email o username

    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/Email e password obbligatori' });
      return;
    }

    // Cerca utente per username o email
    const user = await getUserByUsernameOrEmail(identifier);

    if (!user) {
      res.status(401).json({ error: 'Credenziali non valide' });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenziali non valide' });
      return;
    }

    // Genera JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login effettuato con successo',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        library_id: user.library_id
      }
    });

  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

// REGISTRAZIONE
export const registerController = async (req: Request, res: Response) => {
  const {firstName, lastName, username, email, password, city, province } = req.body;

  // Regex per email e password sicura
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // Min 8, lettere e numeri

  if (!usernameRegex.test(username)) {
    res.status(400).json({ error: 'Username non valido. Usa almeno 3 caratteri alfanumerici o underscore.' });
    return;
  }
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Email non valida.' });
    return;
  }
  if (!passwordRegex.test(password)) {
    res.status(400).json({ error: 'La password deve avere almeno 8 caratteri, numeri e lettere.' });
    return;
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await createUser(firstName, lastName, username, email, passwordHash, city, province);
    res.status(201).json({ message: 'Registrazione completata!' });
    return;
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(400).json({ error: 'Username o email già esistenti.' });
      return;
    } else {
      res.status(500).json({ error: 'Errore interno del server.' });
      return;
    }
  }
};

//DETTAGLI UTENTE
export async function getDetailsProfile(req: Request, res: Response){

  try {
      const id = Number(req.params.id);
      const user = await getUserById(id);
    
    if (user) {
    res.json(user);
    } else {
      res.status(404).json({ error: 'Utente non trovato' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dell\'utente' });
  }

}