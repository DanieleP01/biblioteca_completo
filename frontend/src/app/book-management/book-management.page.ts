import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { AddBookModalComponent } from '../components/add-book-modal/add-book-modal.component';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Book } from '../models/book.model';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-book-management',
  templateUrl: './book-management.page.html',
  styleUrls: ['./book-management.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, AddBookModalComponent]
})

export class BookManagementPage implements OnInit {

  books: Book[] = [];
  isRemoveMode = false;
  selectedBooks: Set<number> = new Set();
  isLoading = false;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private modalController: ModalController,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.http.get<Book[]>(`${this.apiUrl}/books`).subscribe({
      next: (res) => {
        this.books = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alertService.presentAlert('Errore', 'Errore nel caricamento dei libri');
      }
    });
  }

  toggleRemoveMode() {
    this.isRemoveMode = !this.isRemoveMode;
    if (!this.isRemoveMode) {
      this.selectedBooks.clear();
    }
  }

  toggleBookSelection(bookId: number) {
    if (!this.isRemoveMode) return;
    if (this.selectedBooks.has(bookId)) {
      this.selectedBooks.delete(bookId);
    } else {
      this.selectedBooks.add(bookId);
    }
  }

  async addBook() {
    //crea la modale con il componente
    const modal = await this.modalController.create({
      component: AddBookModalComponent,
      cssClass: 'add-book-modal'
    });

    await modal.present();

    //attende che l'utente chiude la modale e riceve i dati
    const { data } = await modal.onDidDismiss();

    // se il libro è stato aggiunto con successo, ricarica la lista dei libri
    if (data && data.bookAdded) {
      this.loadBooks();
    }

  }

  // Alert di conferma prima di rimuovere il/i libri
  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Eliminazione',
      message: 'Sei sicuro di voler rimuovere i libri selezionati?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Conferma',
          handler: () => {
            this.removeSelectedBooks();
          }
        }
      ]
    });
    await alert.present();
  }

  removeSelectedBooks() {
    if (this.selectedBooks.size === 0) {
      this.alertService.presentAlert('Errore', 'Seleziona almeno un libro');
      return;
    }

    this.isLoading = true;
    const book_ids = Array.from(this.selectedBooks);
    
    this.http.request('delete', `${this.apiUrl}/books/delete`, { 
      body: { book_ids } 
    }).subscribe({
      next: () => {
        this.selectedBooks.clear();
        this.isRemoveMode = false;
        this.isLoading = false;
        window.location.reload();
        //this.loadBooks();
        this.alertService.presentAlert('Successo', 'Libri eliminati dal sistema');
      },
      error: () => {
        this.isLoading = false;
        this.alertService.presentAlert('Errore', 'Errore nell\'eliminazione');
      }
    });
  }

  isBookSelected(bookId: number): boolean {
    return this.selectedBooks.has(bookId);
  }
}
