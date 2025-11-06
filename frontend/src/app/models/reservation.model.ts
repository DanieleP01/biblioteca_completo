export interface libraryBook {
    id: number,
    title: string,
    author: string,
    isbn: string,
    category: string,
    cover_url: string,
    description: string,
    year: number,
    total_copies: number,
    available_copies: number,
    library_id: number,
}

// Crea una nuova prenotazione
export interface Reservation {
    id: number;
    user_id: number;
    book_id: number;
    username: string;
    reservation_date: string;
}