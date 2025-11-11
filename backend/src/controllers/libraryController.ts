import { Request, Response } from 'express';
import { getAllLibraries, getLibraryById, getLibraryByManagerId } from '../models/library.js';

//Recupera tutte le librerie
export async function getLibrariesController(req: Request, res: Response) {
  try {
    const libraries = await getAllLibraries();
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei libri' });
  }
}

//Recuper una libreria per id
export async function getLibraryByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const library = await getLibraryById(id);
    if (library) {
      res.json(library);
    } else {
      res.status(404).json({ error: 'Libro non trovato' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero del libro' });
  }
}

//Recupera la libreria del bibliotecario selezionato
 export async function getLibraryByManagerIdController(req: Request, res: Response) {
    try {
      const managerId = req.params.managerId;

      if (!managerId) {
        return res.status(400).json({ error: 'Manager ID è obbligatorio' });
      }

      const library = await getLibraryByManagerId(parseInt(managerId));
      
      if (!library) {
        return res.status(404).json({ 
          error: 'Nessuna biblioteca gestita da questo bibliotecario' 
        });
      }

      res.json(library);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }