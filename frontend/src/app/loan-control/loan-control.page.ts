import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { library } from 'ionicons/icons';

@Component({
  selector: 'app-loan-control',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './loan-control.page.html',
  styleUrls: ['./loan-control.page.scss']
})
export class LoanControlPage implements OnInit {
  currentUser: any;
  pendingLoans: any[] = [];
  libraryManager: any;
  isLoading = false;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser(); // Ottieni l'utente corrente

    this.getLibraryManager();
  }

  getLibraryManager() {
    this.isLoading = true;
    
    // Assumendo che il bibliotecario abbia una library_id associata
    const managerId = this.currentUser.id;
    console.log("ID Bibliotecario:", managerId);
    console.log("Utente corrente:", this.currentUser); 

    this.http.get<any[]>(`${this.apiUrl}/librerie/manager/${managerId}`).subscribe({
      next: (library) => {
        this.libraryManager = library;
        console.log("Biblioteca del bibliotecario:", this.libraryManager);
        this.loadPendingLoans();
      },
      error: (error) => {
        console.error('Errore ottenimento dati bibliotecario:', error);
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
    
  }

  // Carica richieste in attesa per la biblioteca del bibliotecario
  loadPendingLoans() {

    this.http.get<any[]>(`${this.apiUrl}/libraries/${this.libraryManager.id}/pending-loans`).subscribe({
      next: (loans) => {
        this.pendingLoans = loans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento prestiti:', error);
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

  // Approva un prestito
  approveLoan(loanId: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/loans/${loanId}/approve`, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Prestito approvato con successo!');
        this.loadPendingLoans(); // Ricarica la lista
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore approvazione:', error);
        alert('Errore nell\'approvazione del prestito');
      }
    });
  }

  // Rifiuta un prestito
  rejectLoan(loanId: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/loans/${loanId}/reject`, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Prestito rifiutato');
        this.loadPendingLoans(); // Ricarica la lista
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore rifiuto:', error);
        alert('Errore nel rifiuto del prestito');
      }
    });
  }

  // Torna alla home
  goBack() {
    this.router.navigate(['/home']);
  }
}
