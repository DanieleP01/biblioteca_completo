import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Book } from '../models/book.model';
import { Library, libraryBook } from '../models/library.model';
import { AuthService } from '../services/auth.service.js';
import { AlertService } from '../services/alert.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './loan-request.page.html',
  styleUrls: ['./loan-request.page.scss']
})

export class LoanRequestPage implements OnInit {
  selectedBook: Book | null = null;
  selectedAuthor: string = '';
  selectedLibrary: Library | null = null;

  bookSuggestions: Book[] = [];
  authorSuggestions: string[] = [];
  librarySuggestions: Library[] = [];

  showBookSuggestions = false;
  showAuthorSuggestions = false;
  showLibrarySuggestions = false;
  isLoading = false;

  bookSearchQuery = '';
  librarySearchQuery = '';

  private preselectedBook: Book | null = null; //per tenere traccia del libro passato da book-detail

  currentUser: User | null = null;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    const navigation = this.router.getCurrentNavigation();
    
    const state = navigation?.extras.state as { book: Book }; //utilizzo di una variabile intermedia per effettuare il cast di book

    if (state && state.book) { 
      this.preselectedBook = state.book; 
    }
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/home']);
      return;
    }
  }

  // utilizza il libro pre-selezionato proveniente da book-detail
  ionViewWillEnter() { 
    if (this.preselectedBook) {
      this.selectBook(this.preselectedBook);
      this.preselectedBook = null; 
    } else {
      console.log("libro non passato alla pagina sucessiva");
    }
  }

  //suggerisci i libri disponibili in base a ciò che si scrive
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
    this.http.get<Book[]>(`${this.apiUrl}/libri`).subscribe({
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

  //seleziona automaticamente l'autore del libro "selezionato"
  loadAllAuthors() {
    this.http.get<Book[]>(`${this.apiUrl}/libri`).subscribe({
      next: (books: any) => {
        const authorsSet = new Set(books.map((book: any) => book.author));
        this.authorSuggestions = Array.from(authorsSet).sort() as string[];
      },
      error: (error) => {
        console.error('Errore caricamento autori:', error);
      }
    });
  }

  onAuthorFocus() {
    this.showAuthorSuggestions = true;
  }

  selectAuthor(author: string) {
    this.selectedAuthor = author;
    this.showAuthorSuggestions = false;
  }

  //libro selezionato da detail-books
  selectBook(book: Book) {
    this.selectedBook = book;
    this.bookSearchQuery = book.title;
    this.selectedAuthor = book.author;
    this.showBookSuggestions = false;
    this.loadLibrariesForBook(book.id);
  }

  //lista biblioteche per libro selezionato
  loadLibrariesForBook(bookId: number) {
    console.log("libro selezionato: ", bookId);
    this.http.get<Library[]>(`${this.apiUrl}/books/${bookId}/libraries`).subscribe({
      next: (response) => {
        this.librarySuggestions = response.filter((lib: any) => lib.total_copies > 0);

        if (this.librarySuggestions.length === 0) {
          this.alertService.presentAlert('Nessuna biblioteca', 'Spiacenti, questo libro non è disponibile in nessuna biblioteca');
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

    if (library.available_count > 0) {
      this.selectedLibrary = library;
      this.librarySearchQuery = library.name;
      this.showLibrarySuggestions = false;
    } else {
      this.librarySearchQuery = library.name;
      this.selectedLibrary = library; 
      this.showLibrarySuggestions = false;
    }
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showBookSuggestions = false;
      this.showAuthorSuggestions = false;
      this.showLibrarySuggestions = false;
    }, 200);
  }

  isFormValid(): boolean {
    return !!(
      this.selectedBook && 
      this.selectedAuthor && 
      this.selectedLibrary &&
      this.selectedLibrary.available_copies > 0
    );
  }

  //invio richiesta prestito
  submitLoanRequest() {
    if (!this.isFormValid()) {
      this.alertService.presentAlert('Errore','Compila tutti i campi richiesti');
      return;
    }
    this.isLoading = true;

    const loanRequest = {
      user_id: this.currentUser?.id,
      book_id: this.selectedBook?.id,
      library_id: this.selectedLibrary!.id
    };
    

    this.http.post(`${this.apiUrl}/loans/request`, loanRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo!','Richiesta di prestito inviata con successo!');
        this.resetForm();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || 'Errore durante l\'invio della richiesta';
        this.resetForm();
        this.alertService.presentAlert('Errore',errorMsg);
      }
    });
  }

  //crea prenotazione
   createReservation(library: any, event: MouseEvent) {
    event.stopPropagation(); 

    if (!this.selectedBook || !library || !this.currentUser) {
      this.alertService.presentAlert('Errore', 'Dati mancanti per la prenotazione.');
      return;
    }
    
    this.isLoading = true;

    const reservationRequest = {
      user_id: this.currentUser.id,
      book_id: this.selectedBook.id,
      library_id: library.id // Usa l'ID della libreria passata
    };

    this.http.post(`${this.apiUrl}/create-reservation`, reservationRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo!', 'Libro prenotato con successo! Verrai notificato quando sarà disponibile.');
        this.resetForm(); // Resetta il form e chiudi la pagina
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || 'Errore durante la prenotazione';
        this.alertService.presentAlert('Errore', errorMsg);
      }
    });
  }

  private resetForm() {
    // Resetta i campi di testo
    this.bookSearchQuery = '';
    this.librarySearchQuery = '';

    // Resetta i dati principali selezionati
    this.selectedBook = null;
    this.selectedAuthor = '';
    this.selectedLibrary = null;

    // Resetta le liste di suggerimenti
    this.bookSuggestions = [];
    this.authorSuggestions = [];
    this.librarySuggestions = [];

    // Nasconde tutti i popup di suggerimenti
    this.showBookSuggestions = false;
    this.showAuthorSuggestions = false;
    this.showLibrarySuggestions = false;

    // Resetta lo stato di caricamento
    this.isLoading = false;
  }

  goBack() {
    this.resetForm();
    this.router.navigate(['/home']);
  }
}
