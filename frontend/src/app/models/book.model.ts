export interface Book {
    id: number,
    title: string,
    author: string,
    isbn: string,
    category: string,
    cover_url: string,
    description: string,
    year: number,
    content_path: string;
}

export interface NewBook {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  cover_url: string;
  year: number;
}