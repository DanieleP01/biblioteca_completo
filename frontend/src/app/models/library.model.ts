export interface Library {
    id: number,
    name: string,
    address: string,
    city: string,
    province: string,
    manager_id: number,
    cover_url: string,
    total_copies: number,
    available_copies: number,
    available_count: number;
}

export interface libraryBook {
    id: number,
    title: string,
    author: string,
    isbn: string,
    category: string,
    cover_url: string,
    description: string,
    year: number,
    content_path: string,
    total_copies: number,
    available_copies: number,
    library_id: number,
}