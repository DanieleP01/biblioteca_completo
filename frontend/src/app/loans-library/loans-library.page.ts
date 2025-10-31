import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loans-library',
  templateUrl: './loans-library.page.html',
  styleUrls: ['./loans-library.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})

export class loanslibrary implements OnInit {
  currentUser: any;
  activeLibrary: any;
  activeLoans: any;
  overdueLoans: any;
  isLoading = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();

    this.loadLoan();
  }

  //carica i prestiti della biblioteca
  loadLoan(){
    this.isLoading = true;
    
    const managerId = this.authService.getUser()?.id;

    this.http.get<any[]>(`${this.apiUrl}/librerie/manager/${managerId}`).subscribe({
      next: (library) => {
        this.activeLibrary = library;
        console.log("Biblioteca del bibliotecario:", this.activeLibrary);
        //carica i prestiti attivi
        this.loadActiveLoans();
        //carica i prestiti scaduti
        console.log("prestiti scaduti 1:" +this.overdueLoans);
        this.loadExpiringLoans();
      },
      error: (error) => {
        console.error('Errore ottenimento dati bibliotecario:', error);
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

  //prestiti attivi della biblioteca
  loadActiveLoans(){
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/libraries/${this.activeLibrary.id}/active-loans`).subscribe({
      next: (loans) => {
        this.activeLoans = loans;
        //this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        alert('Errore nel caricamento dei prestiti attivi della biblioteca');
      }
    });
  }

  //prestiti scaduti della biblioteca
  loadExpiringLoans(){
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/libraries/${this.activeLibrary.id}/expiring-loans`).subscribe({
      next: (loans) => {
        this.overdueLoans = loans;
        console.log("prestiti scaduti: ", this.overdueLoans);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        alert('Errore nel caricamento dei prestiti scaduti della biblioteca');
      }
    });
  }

  //calcola i giorni rimanenti
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

  /* Ritorna la classe CSS in base ai giorni rimasti
     Danger: < 3 giorni
     Warning: 3-7 giorni
     Success: > 7 giorni */
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

}
