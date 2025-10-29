import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book.model.js';
import { AuthService } from '../services/auth.service.js';

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
  userid: number | null = null;
  hasActiveLoan = false;
  activeLoan: any = null;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.checkLoginStatus();
    if (this.isUser && this.userid !== null && id) {
      this.checkActiveLoan(this.userid, Number(id));
    }
    if(id) {
      this.loadBookDetails(id);
    } else {
      this.router.navigate(['home']);
    }
    
  }

  loadBookDetails(id: String) {
    this.isLoading = true;
    this.http.get<Book>(`${this.apiUrl}/libri/${id}`)
          .subscribe({
            next: (libro) => {
              this.book = libro;
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }
          });
  }

  checkLoginStatus(){
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isUser = this.authService.getUserRole() === 'user';
    this.userid = this.authService.getUserId();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  //richiesta prestito
  loanRequestDetail() {
    if (this.book) {
      // 4. Naviga alla pagina di prestito passando l'oggetto 'book' nello state
      this.router.navigate(['/loan-request'], { // 
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
        alert('Libro restituito con successo!');
        this.hasActiveLoan = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Errore Restituzione!', error);
      }
    });

  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
