import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service.js';
import { AlertService } from '../services/alert.service.js';
import { Router } from '@angular/router';
import { User } from '../models/user.model.js';
import { Loan } from '../models/loan.model.js';

@Component({
  selector: 'app-loans-history',
  templateUrl: './loans-history.page.html',
  styleUrls: ['./loans-history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class LoansHistoryPage implements OnInit {
  currentUser: User | null = null;
  loans: Loan[] = [];
  overdueLoans: Loan[] = [];
  returnedLoans: Loan[] = [];
  rejectedLoans: Loan[] = [];

  isLoading = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }
  ///users/:userId/loans

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadLoans();
  }

  //carica i prestiti
  loadLoans(){
    this.isLoading = true;
    
    this.http.get<Loan[]>(`${this.apiUrl}/users/${this.currentUser?.id}/loans`).subscribe({
      next: (res) => {
        this.loans = res;
        this.overdueLoans = this.loans.filter((loan: any) => loan.status === 'overdue');
        this.returnedLoans = this.loans.filter((loan: any) => loan.status === 'returned');
        this.rejectedLoans = this.loans.filter((loan: any) => loan.status === 'rejected');
        console.log("prestiti rifiutati: ", this.rejectedLoans);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.presentAlert('Errore', 'Errore nel caricamento delle richieste');
      }
    });
  }

}
