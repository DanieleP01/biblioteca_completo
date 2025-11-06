import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service.js';
import { libraryBook, Reservation } from '../models/reservation.model.js';
import { Book } from '../models/book.model.js';
import { CopyRequestModalComponent } from '../components/copy-request-modal/copy-request-modal.component.js';

@Component({
  selector: 'app-reservation',
  templateUrl: './inventory-reservations.page.html',
  styleUrls: ['./inventory-reservations.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class InventoryReservationsPage implements OnInit {
  libraryBook: libraryBook[] = [];
  currentUser: any;
  isLoading = false;
  reservation: { [bookId: number]: Reservation[] } = {};
  expandedBookIds: Set<number> = new Set();

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadLibraryBook();
  }

  loadLibraryBook(){
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/libraries/${this.currentUser.library_id}/books`).subscribe({
      next: (res) => {
        this.libraryBook = res;
        console.log("Libri della biblioteca: ", this.libraryBook);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

   toggleReservations(bookId: number) {

    if (this.expandedBookIds.has(bookId)) {
      this.expandedBookIds.delete(bookId);
    } else {
      this.expandedBookIds.add(bookId);
      if (!this.reservation[bookId]) {
        this.http.get<Reservation[]>(`${this.apiUrl}/libraries/${this.currentUser.library_id}/books/${bookId}/reservations`).subscribe({
          next: (res) => {
            this.reservation[bookId] = res;
            console.log(this.currentUser.library_id, bookId);
            console.log(`Prenotazioni per libro ${bookId}:`, res);
          },
          error: (error) => {
            alert('Errore nel caricamento delle prenotazioni');
          }
        });
      }
    }
  }

  isExpanded(bookId: number): boolean {
    return this.expandedBookIds.has(bookId);
  }
  // Richiesta Copie per un libro di una biblioteca
   async requestCopies(book: Book) {

    const modal = await this.modalController.create({

      component: CopyRequestModalComponent,

      componentProps: {

        book: book,

        libraryId: this.currentUser.library_id,

        librarianId: this.currentUser.id,

        apiUrl: this.apiUrl

      },

      cssClass: 'copy-request-modal'

    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.success) {

      alert('Richiesta di copie inviata con successo');

    }

  }

}





