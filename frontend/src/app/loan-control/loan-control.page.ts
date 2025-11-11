import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { library } from 'ionicons/icons';
import { User } from '../models/user.model';
import { Library } from '../models/library.model';
import { Loan } from '../models/loan.model';

@Component({
  selector: 'app-loan-control',
  templateUrl: './loan-control.page.html',
  styleUrls: ['./loan-control.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  
})
export class LoanControlPage implements OnInit {
  currentUser: User | null = null;
  pendingLoans: Loan[] = [];
  libraryManager: Library | null = null;
  isLoading = false;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser(); // Ottieni l'utente corrente

    this.getLibraryManager();
  }

  getLibraryManager() {
    this.isLoading = true;

    const managerId = this.currentUser?.id;
    console.log("ID Bibliotecario:", managerId);
    console.log("Utente corrente:", this.currentUser); 

    this.http.get<Library>(`${this.apiUrl}/libraries/manager/${managerId}`).subscribe({
      next: (library) => {
        this.libraryManager = library;
        //console.log("Biblioteca del bibliotecario:", this.libraryManager);
        this.loadPendingLoans();
      },
      error: (error) => {
        console.error('Errore ottenimento dati bibliotecario:', error);
        this.isLoading = false;
        this.alertService.presentAlert('Errore','Errore nel caricamento delle richieste');
      }
    });
    
  }

  // Carica richieste in attesa per la biblioteca del bibliotecario
  loadPendingLoans() {

    this.http.get<Loan[]>(`${this.apiUrl}/libraries/${this.libraryManager?.id}/pending-loans`).subscribe({
      next: (loans) => {
        this.pendingLoans = loans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento prestiti:', error);
        this.isLoading = false;
        this.alertService.presentAlert('Errore', 'Errore nel caricamento delle richieste');
      }
    });
  }

  // Approva un prestito
  approveLoan(loanId: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/loans/${loanId}/approve`, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo', 'Prestito approvato con successo!');
        this.loadPendingLoans(); 
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore approvazione:', error);
        this.alertService.presentAlert('Errore', 'Errore nell\'approvazione del prestito');
      }
    });
  }

  // Rifiuta un prestito
  rejectLoan(loanId: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/loans/${loanId}/reject`, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo', 'Prestito rifiutato');
        this.loadPendingLoans(); 
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore rifiuto:', error);
        this.alertService.presentAlert('Errore', 'Errore nel rifiuto del prestito');
      }
    });
  }

  // Torna alla home
  goBack() {
    this.router.navigate(['/home']);
  }
}
