import { Request, Response } from 'express';
import { searchBooksAndLibraries } from '../models/search.js';

export async function getSearchController(req: Request, res: Response) {
    try {
        const query = req.query.q as string;

        //validazione della query
        if(!query || query.trim() == '') {
            res.status(400).json({ error: 'Query di ricerca vuota'});
            return;
        }

        const results = await searchBooksAndLibraries(query.trim());

        //risposta
        res.json({
            query: query,
            books: results.books,
            libraries: results.libraries,
            totalResult: results.totalResult
        });
        
    } catch ( error ){
        console.error('errore ricerca:', error);
        res.status(500).json({ error: 'Errore nel servizio di ricerca' });
    }
}