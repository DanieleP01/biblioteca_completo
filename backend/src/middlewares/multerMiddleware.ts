import multer, { StorageEngine } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); //converte l'url del modulo attuale a un percorso file locale
const __dirname = path.dirname(__filename); //estrae la directory dal percorso del file

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const bookStoragePath = path.resolve(__dirname, '../../storage/books');
    cb(null, bookStoragePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/plain' && !file.originalname.endsWith('.txt')) {
      cb(new Error('Solo file .txt sono permessi'));
    } else {
      cb(null, true);
    }
  }
});

export const uploadMiddleware = upload.single('file');