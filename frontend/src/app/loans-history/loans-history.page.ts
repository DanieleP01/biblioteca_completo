import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service.js';
import { Router } from '@angular/router';
import { User } from '../models/user.model.js';

@Component({
  selector: 'app-loans-history',
  templateUrl: './loans-history.page.html',
  styleUrls: ['./loans-history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class LoansHistoryPage implements OnInit {
  currentUser: any;
  loans: any;
  overdueLoans: any;
  returnedLoans: any;
  rejectedLoans: any;

  isLoading = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }
  ///users/:userId/loans

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadLoans();
  }

  //carica i prestiti
  loadLoans(){
    this.isLoading = true;
    
    this.http.get<any[]>(`${this.apiUrl}/users/${this.currentUser.id}/loans`).subscribe({
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
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

}
