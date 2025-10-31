import { openDb } from './db.js';

export async function searchBooksAndLibraries(query: string) {
    const db = await openDb();
    const searchterm = `%${query}%`.trim();

    try {
        const books = await db.all(
            'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY title ASC LIMIT 50',
            [searchterm, searchterm]
        );

        const libraries = await db.all(
            'SELECT * FROM libraries WHERE name LIKE ? OR city LIKE ? OR address LIKE ? ORDER BY name ASC LIMIT 50',
            [searchterm, searchterm, searchterm]
        );

        const totalResult = (books?.length || 0) + (libraries?.length || 0);

        return {
            books: books || [],
            libraries: libraries || [],
            totalResult
        };

    } finally {
        await db.close();
    }
}