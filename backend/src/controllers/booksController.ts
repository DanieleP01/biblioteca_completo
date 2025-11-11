import { Request, Response } from 'express';
import * as BooksModel  from '../models/books.js';
import * as LoansModel from '../models/loans.js';
import * as NotificationsModel from '../models/notifications.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //converte l'url del modulo attuale a un percorso file locale
const __dirname = path.dirname(__filename); //estrae la directory dal percorso del file

//recupera tutti i libri
export async function getBooksController(req: Request, res: Response) {
  try {
    const books = await BooksModel.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei libri' });
  }
}

//recupera un libro per id
export async function getBookByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const book = await BooksModel.getBookById(id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Libro non trovato' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del libro' });
  }
}

// Rimuove libri da biblioteca
export async function deleteBooks(req: Request, res: Response) {
  try {

    const { book_ids } = req.body;

    if (!book_ids || !book_ids.length) {
      return res.status(400).json({ error: 'Nessun libro selezionato' });
    }

    //recupera tutti i dati prima di eliminare e crea le notifiche
    const notificationsToSend = [];

    for (const bookId of book_ids) {
      const book = await BooksModel.getBookById(bookId);
      const librarians = await BooksModel.getLibrariansByBookId(bookId);
      const users = await BooksModel.getUsersByBookId(bookId);

      // Aggiungi notifiche ai bibliotecari
      for (const librarian of librarians) {
        notificationsToSend.push({
          recipient_id: librarian.id,
          recipient_role: 'librarian',
          title: 'Libro Rimosso',
          message: `Il libro "${book.title}" è stato rimosso dal sistema da un amministratore.`,
          type: 'book_deleted',
        });
      }

      // Aggiungi notifiche agli utenti
      for (const user of users) {
        notificationsToSend.push({
          recipient_id: user.id,
          recipient_role: 'user',
          title: 'Prestito Annullato',
          message: `Il libro "${book.title}" che avevi in prestito è stato rimosso dal sistema. Il tuo prestito è stato annullato.`,
          type: 'loan_cancelled',
        });
      }
    }

    // Elimina i libri (CASCADE elimina le associazioni)
    const changes = await BooksModel.deleteBooks(book_ids);

    //invia le notifiche
    for(const notification of notificationsToSend){
      await NotificationsModel.createNotification(notification);
    }
    
    if (changes === 0) {
      return res.status(404).json({ error: 'Libri non trovati' });
    }

    res.json({ message: 'Libri eliminati da tutte le biblioteche' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

//legge il file per il contenuto del libro
export async function getBookContentFromFile(req: Request, res: Response) {
  try {
    const content_path = req.params.content_path;
    //console.log(content_path);
    if (!content_path) return res.status(400).json({ error: "Parametro mancante" });

    //console.log("path: ", content_path);
    // Costruisci percorso file assoluto
    const filePath = path.resolve(__dirname, "../../storage/books", content_path);

    // Leggi contenuto file
    const content = await fs.readFile(filePath, { encoding: "utf-8" });

    // Invia il contenuto
    res.json({ content: content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 
