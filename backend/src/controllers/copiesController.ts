import { Request, Response } from 'express';
import * as copiesModel from '../models/copies.js';

    // Gestisce la richiesta di creazione di una nuova prenotazione
    export async function createCopyRequest(req: Request, res: Response) {
        const { book_id, library_id, librarian_id, requested_copies, reason } = req.body;
        console.log('Ricevuta richiesta di copie:', { book_id, library_id, librarian_id, requested_copies, reason });

        try {
            const copyRequestId = await copiesModel.requestCopy(book_id, library_id, librarian_id, requested_copies, reason);
            res.status(201).json({ id: copyRequestId });
        } catch (error) {
            console.error('Error creating copy request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
