import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Book } from '../../models/book.model.js';

@Component({
  selector: 'app-copy-request-modal',
  templateUrl: './copy-request-modal.component.html',
  styleUrls: ['./copy-request-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})

export class CopyRequestModalComponent implements OnInit {

  @Input() book!: Book;
  @Input() libraryId!: number;
  @Input() librarianId!: number;

  private apiUrl = 'http://localhost:3000/api';

  requestedCopies: number = 1;

  reason: string = 'Alta richiesta di prenotazioni';

  isLoading = false;

  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  dismiss() {

    this.modalController.dismiss();

  }

  submitRequest() {

    if (this.requestedCopies <= 0) {
      alert('Il numero di copie deve essere maggiore di 0');
      return;
    }

    if (!this.reason.trim()) {
      alert('Inserisci un motivo per la richiesta');
      return;
    }

    this.isLoading = true;

    const copiesRequest = {
      book_id: this.book.id,
      library_id: this.libraryId,
      librarian_id: this.librarianId,
      requested_copies: this.requestedCopies,
      reason: this.reason
    };

    this.http.post(`${this.apiUrl}/copy-requests/request`, copiesRequest).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.modalController.dismiss({ success: true });
      },
      error: (error) => {
        this.isLoading = false;
        alert('Errore nell\'invio della richiesta');
        console.error(error);
      }
    });

  }

}
