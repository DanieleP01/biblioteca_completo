import cors from 'cors';

const corsOptions = {
  origin: '*', // Cambia con il dominio frontend in produzione
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);