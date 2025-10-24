import { Request, Response } from 'express';
import { createUser } from '../models/user.js';
import bcrypt from 'bcrypt';

// POST /api/registrazione
export const registerController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Regex per email e password sicura
  const usernameRegex = /^[a-zA-Z0-9_]$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // Min 8, lettere e numeri

  if (!usernameRegex.test(username)) {
    res.status(400).json({ error: 'Username non valido. Usa caratteri alfanumerici o underscore.' });
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
    await createUser(username, email, passwordHash);
    res.status(201).json({ message: 'Registrazione completata!' });
    return;
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint')) {
      res.status(400).json({ error: 'Username o email già esistenti.' });
      return;
    } else {
      res.status(500).json({ error: 'Errore interno.' });
      return;
    }
  }
};