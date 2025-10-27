import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanRequest {
  user_id: number;
  book_id: number;
  library_id: number;
}

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  library_id: number;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: 'pending' | 'active' | 'overdue' | 'returned' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Richiesta prestito
  requestLoan(loanData: LoanRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/loans/request`, loanData);
  }

  // Ottieni biblioteche che hanno un libro specifico
  getLibrariesByBook(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/${bookId}/libraries`);
  }

  // Verifica disponibilità
  checkAvailability(libraryId: number, bookId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/availability/${libraryId}/${bookId}`);
  }

  // Ottieni prestiti dell'utente
  getUserLoans(userId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/users/${userId}/loans`);
  }
}