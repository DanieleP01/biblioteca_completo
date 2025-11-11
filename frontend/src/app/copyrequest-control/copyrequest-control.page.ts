import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-copy-request-control',
  templateUrl: './copyrequest-control.page.html',
  styleUrls: ['./copyrequest-control.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})

export class CopyRequestControlPage implements OnInit {

  currentUser: any;

  pendingRequests: any[] = [];

  isLoading = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {

    this.currentUser = this.authService.getUser();
    this.loadPendingRequests();
  }

  //mostra richieste di copie in attesa
  loadPendingRequests() {

    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/copy-requests/pending`).subscribe({
      next: (req) => {
        this.pendingRequests = req;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento richieste:', err);
        this.isLoading = false;
        this.alertService.presentAlert('Errore!', 'Errore nel caricamento delle richieste');
      }
    });

  }

  //accetta la richiesta
  approveCopyRequest(requestId: number, bookId: number, libraryId: number, requestedCopies: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/copy-requests/${requestId}/approve`, {
      book_id: bookId,
      library_id: libraryId,
      requested_copies: requestedCopies
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo!','Richiesta approvata con successo!');
        this.loadPendingRequests();
      },

      error: (error) => {
        this.isLoading = false;
        console.error('Errore approvazione:', error);
        this.alertService.presentAlert('Errore!','Errore nell\'approvazione della richiesta');
      }

    });

  }

  //rifiuta richiesta
  rejectCopyRequest(requestId: number) {
    this.isLoading = true;

    this.http.patch(`${this.apiUrl}/copy-requests/${requestId}/reject`, {}).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.presentAlert('Successo!','Richiesta rifiutata con successo');
        this.loadPendingRequests();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore rifiuto:', error);
        console.log("");
        this.alertService.presentAlert('Errore!',error);
      }

    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
