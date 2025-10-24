import { Request, Response } from 'express';
import { getAllBooks, getBookById } from '../models/books.js';

export async function getBooksController(req: Request, res: Response) {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei libri' });
  }
}

export async function getBookByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const book = await getBookById(id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Libro non trovato' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del libro' });
  }
}