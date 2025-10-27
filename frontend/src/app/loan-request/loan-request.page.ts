import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Book } from '../models/book.model';
import { Library } from '../models/library.model';
import { AuthService } from '../services/auth.service.js';
import { LoanService } from '../services/loan.service.js';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './loan-request.page.html',
  styleUrls: ['./loan-request.page.scss']
})
export class LoanRequestPage implements OnInit {
  // Dati form
  selectedBook: Book | null = null;
  selectedAuthor: string = '';
  selectedLibrary: Library | null = null;

  // Suggerimenti
  bookSuggestions: Book[] = [];
  authorSuggestions: string[] = [];
  librarySuggestions: Library[] = [];

  // Stati UI
  showBookSuggestions = false;
  showAuthorSuggestions = false;
  showLibrarySuggestions = false;
  isLoading = false;

  // Campi di ricerca
  bookSearchQuery = '';
  librarySearchQuery = '';

  // Utente
  currentUser: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    
    // Se non loggato, torna alla home
    if (!this.currentUser) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadAllAuthors();
  }

  // Carica tutti gli autori disponibili
  loadAllAuthors() {
    this.http.get<Book[]>('http://localhost:3000/api/libri').subscribe({
      next: (books: any) => {
        const authorsSet = new Set(books.map((book: any) => book.author));
        this.authorSuggestions = Array.from(authorsSet).sort() as string[];
      },
      error: (error) => {
        console.error('Errore caricamento autori:', error);
      }
    });
  }

  // === GESTIONE TITOLO LIBRO ===

  onBookInput(event: any) {
    const query = event.target.value;
    this.bookSearchQuery = query;
    
    if (query.length > 2) {
      this.searchBooks(query);
    } else {
      this.showBookSuggestions = false;
      this.bookSuggestions = [];
    }
  }

  searchBooks(query: string) {
    this.http.get<Book[]>('http://localhost:3000/api/libri').subscribe({
      next: (books: any) => {
        this.bookSuggestions = books.filter((book: any) =>
          book.title.toLowerCase().includes(query.toLowerCase())
        );
        this.showBookSuggestions = this.bookSuggestions.length > 0;
      },
      error: (error) => {
        console.error('Errore ricerca libri:', error);
      }
    });
  }

  selectBook(book: Book) {
    this.selectedBook = book;
    this.bookSearchQuery = book.title;
    this.selectedAuthor = book.author;
    this.showBookSuggestions = false;
    this.loadLibrariesForBook(book.id);
  }

  // === GESTIONE AUTORE ===

  onAuthorFocus() {
    this.showAuthorSuggestions = true;
  }

  selectAuthor(author: string) {
    this.selectedAuthor = author;
    this.showAuthorSuggestions = false;
  }

  // === GESTIONE BIBLIOTECA ===

  loadLibrariesForBook(bookId: number) {
    this.loanService.getLibrariesByBook(bookId).subscribe({
      next: (libraries: any) => {
        this.librarySuggestions = libraries.filter((lib: any) => lib.copies > 0);

        if (this.librarySuggestions.length === 0) {
          alert('Spiacenti, questo libro non è disponibile in nessuna biblioteca');
        }
      },
      error: (error) => {
        console.error('Errore caricamento biblioteche:', error);
      }
    });
  }

  onLibraryFocus() {
    if (this.librarySuggestions.length > 0) {
      this.showLibrarySuggestions = true;
    }
  }

  onLibraryInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.librarySearchQuery = query;

    if (query.length > 1 && this.librarySuggestions.length > 0) {
      this.showLibrarySuggestions = true;
    }
  }

  getFilteredLibraries() {
    if (!this.librarySearchQuery) {
      return this.librarySuggestions;
    }

    return this.librarySuggestions.filter((lib: any) =>
      lib.name.toLowerCase().includes(this.librarySearchQuery.toLowerCase())
    );
  }

  selectLibrary(library: any) {
    this.selectedLibrary = library;
    this.librarySearchQuery = library.name;
    this.showLibrarySuggestions = false;
  }

  // === GESTIONE SUGGERIMENTI ===

  hideSuggestions() {
    setTimeout(() => {
      this.showBookSuggestions = false;
      this.showAuthorSuggestions = false;
      this.showLibrarySuggestions = false;
    }, 200);
  }

  // === VALIDAZIONE E INVIO ===

  isFormValid(): boolean {
    return !!(this.selectedBook && this.selectedAuthor && this.selectedLibrary);
  }

  async submitLoanRequest() {
    if (!this.isFormValid()) {
      alert('Compila tutti i campi richiesti');
      return;
    }

    if (!this.currentUser) {
      alert('Devi essere loggato per richiedere un prestito');
      return;
    }

    this.isLoading = true;

    const loanRequest = {
      user_id: this.currentUser.id,
      book_id: this.selectedBook!.id,
      library_id: this.selectedLibrary!.id
    };

    this.loanService.requestLoan(loanRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Richiesta di prestito inviata con successo!');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || 'Errore durante l\'invio della richiesta';
        alert('Errore: ' + errorMsg);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
