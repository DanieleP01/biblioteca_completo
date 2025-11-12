import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book.model.js';
import { AuthService } from '../services/auth.service.js';
import { AlertService } from '../services/alert.service.js';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})

export class BookDetailPage implements OnInit {
  book: Book | null = null;
  isLoading = true;
  isLoggedIn = false; //controller login
  isUser = false; //controllo se è utente normale
  isLibrarian = false;
  isAdmin = false;
  userid: number | null = null;
  bookId: number | null = null;
  hasActiveLoan = false;
  activeLoan: any = null;

  bookContent = 0;
  content: string = '';
  bookChapters: string[] = [];
  currentChapter = 0;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {

    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.checkLoginStatus();

    if (this.isUser && this.userid !== null && this.bookId) {
      this.checkActiveLoan(this.userid, Number(this.bookId));
    }if(this.bookId){
      this.loadBookDetails(this.bookId);
    }else {
      this.router.navigate(['home']);
    }
  }

  //carica dettagli libro
  loadBookDetails(id: Number) {
    this.isLoading = true;
    this.http.get<Book>(`${this.apiUrl}/books/${id}`)
          .subscribe({
            next: (libro) => {
              this.book = libro;
              this.isLoading = false;
              this.loadBookContent();
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }
          });
  }

  //carica il contenuto del libro (soltanto se il prestito è attivo)
  loadBookContent() {
    try {
      const content_path = this.book?.content_path;
      if (!content_path) {
        console.warn('Content path vuoto, esco');
        return;
      }

      this.http.get<any>(`${this.apiUrl}/books/${content_path}/content`)
        .subscribe({
          next: (res) => {
            try {
              if (res && res.content) {
                this.content = res.content;
                console.log('contenuto', this.content);
                this.splitContentToChapters(this.content);
              }
            } catch (innerErr) {
              console.error('Errore nel processing della risposta:', innerErr);
            }
          },
          error: (err) => {
            console.error('Errore HTTP caricamento contenuto:', err);
          }
        });
    } catch (err) {
      console.error('Errore generico in loadBookContent:', err);
    }
  }

  //separa il contenuto in Capitoli 
  splitContentToChapters(content: string) {
    if (!content) {
      this.bookChapters = [];
      return;
    }
    this.bookChapters = content.split(/(?=Capitolo)/g).map(chap => chap.trim());
    this.currentChapter = 0;
  }

  checkLoginStatus(){
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isUser = this.authService.getUserRole() === 'user';
    this.isLibrarian = this.authService.getUserRole() === 'librarian';
    this.isAdmin = this.authService.getUserRole() == 'admin';
    this.userid = this.authService.getUserId();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  //richiesta prestito
  loanRequestDetail() {
    if (this.book) {
      //Naviga alla pagina di prestito passando l'oggetto 'book' nello state
      this.router.navigate(['/loan-request'], {  
        state: {
          book: this.book 
        }
      });
    } else {
      console.error('Dati del libro non ancora caricati.');
    }
  }

  // Verifica se l'utente ha un prestito attivo per un libro specifico
  checkActiveLoan(userId: number, bookId: number) {
    console.log('Verifica prestito attivo per utente ID:', userId, 'e libro ID:', bookId);
    this.http.get<any>(`${this.apiUrl}/users/${userId}/active-loan/${bookId}`).subscribe({
      next: (response) => {
        console.log('Verifica prestito attivo:', response);
        this.activeLoan = response.loan;
        this.hasActiveLoan = response.hasActiveLoan;
      },
      error: (error) => {
        console.error('Errore verifica prestito:', error);
        this.hasActiveLoan = false;
      }
    });
  }

  // Restituisci Libro
  returnBook() {
    console.log('Restituzione libro per prestito ID:', this.activeLoan.id);
    this.http.patch<any>(`${this.apiUrl}/loans/${this.activeLoan.id}/return`, {}).subscribe({
      next: (response) => {
        console.log('Libro restituito con successo!', response);
        this.alertService.presentAlert('Successo', 'Libro restituito con successo!');
        this.hasActiveLoan = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.alertService.presentAlert('Errore', error);
        this.hasActiveLoan = false;
      }
    });

  }
  
  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
