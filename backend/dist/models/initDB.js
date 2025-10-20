var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbFile = './database/biblioteca.db';
        const schemaFile = './src/models/schema.sql';
        // Leggi lo schema SQL
        const schema = fs.readFileSync(schemaFile, 'utf-8');
        // Apri/crea il database
        const db = yield open({
            filename: dbFile,
            driver: sqlite3.Database
        });
        // Esegui lo script SQL
        yield db.exec(schema);
        yield db.close();
        console.log('Database creato e inizializzato!');
    });
}
initDB();
//# sourceMappingURL=initDB.js.map