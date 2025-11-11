import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Loan } from '../models/loan.model';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.page.html',
  styleUrls: ['./my-books.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})

export class MyBooksPage implements OnInit {
  currentUser: User | null = null;
  activeLoans: Loan[] = [];
  isLoading = false;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.currentUser = this.authService.getUser();
    console.log('Utente corrente:', this.currentUser);

    if (!this.currentUser) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadActiveLoans();
  }

  // Carica i prestiti attivi dell'utente
  loadActiveLoans() {
    this.isLoading = true;
    const userId = this.currentUser?.id;

    this.http.get<Loan[]>(`${this.apiUrl}/users/${userId}/active-loans`).subscribe({
      next: (loans) => {
        // Filtra solo i prestiti con stato 'active'
        this.activeLoans = loans.filter(loan => loan.status === 'active');
        //console.log('Prestiti attivi filtrati:', this.activeLoans);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento prestiti:', error);
        this.isLoading = false;
        alert('Errore nel caricamento dei tuoi libri');
      }
    });
  }

  /**Calcola i giorni rimasti fino alla scadenza del prestito
   * @param dueDate Data di scadenza
   * @returns Numero di giorni rimasti */
  getDaysRemaining(dueDate: string): number {
    if (!dueDate) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const timeDiff = due.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return Math.max(daysRemaining, 0);
  }

  /** Ritorna la classe CSS in base ai giorni rimasti
   * Danger: < 3 giorni
   * Warning: 3-7 giorni
   * Success: > 7 giorni
   */
  getDaysRemainingClass(dueDate: string): string {
    const daysRemaining = this.getDaysRemaining(dueDate);

    if (daysRemaining < 3) {
      return 'danger';
    } else if (daysRemaining < 7) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  goToRequestLoan() {
    this.router.navigate(['/loan-request']);
  }

  /** Formatta una data al formato italiano
   * @param date Data da formattare
   * @returns Data formattata (dd/MM/yyyy)
   */
  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  //Dettagli Libro in prestito
  goToBookDetail(bookId: number) {
    this.router.navigate([`/book-detail/${bookId}`]);
  }
}
