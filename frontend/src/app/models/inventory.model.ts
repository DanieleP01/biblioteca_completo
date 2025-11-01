export interface inventoryBook {
    id: number,
    title: string,
    author: string,
    isbn: string,
    category: string,
    cover_url: string,
    description: string,
    year: number,
    copies: number,
    library_id: number;
}