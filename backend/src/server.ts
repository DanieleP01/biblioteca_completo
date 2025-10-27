import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './models/initDB.js'; 
import { router as mainRouter } from './index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', mainRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Server Biblioteca attivo!');
});

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});