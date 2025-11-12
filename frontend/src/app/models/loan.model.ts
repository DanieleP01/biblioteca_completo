export interface Loan{
    loan_id: number,
    user_id: number,
    library_id: number,
    book_id: number,
    loan_date: string,
    due_date: string,
    return_date: string,
    status: string,
    title: string,
    firstName: string,
    lastName: string,
    email: string,
    author: string,
    isbn: number,
    library_name: string,
    cover_url: string;
}