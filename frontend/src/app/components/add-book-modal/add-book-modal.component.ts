import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NewBook } from 'src/app/models/book.model';
import { Library } from 'src/app/models/library.model';

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule]
})

export class AddBookModalComponent implements OnInit {
  @Output() bookAdded = new EventEmitter<void>();

  newBook: NewBook = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    cover_url: '',
    year: new Date().getFullYear()
  };

  libraries: Library[] = [];
  libraryBooksCopies: { [key: number]: number } = {};
  isLoading = false;
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLibraries();
  }

  //carica le librerire
  loadLibraries() {
    this.http.get<any>(`${this.apiUrl}/librerie`).subscribe({
      next: (res) => {
        this.libraries = res;
        this.libraryBooksCopies = {};
        this.libraries.forEach(lib => {
        this.libraryBooksCopies[lib.id] = 0;
        });
      },
      error: () => this.showAlert('Errore nel caricamento delle biblioteche')
    });
  }

  saveNewBook() {
    // Valida i campi obbligatori
    if (!this.newBook.title || !this.newBook.author || !this.newBook.isbn) {
      this.showAlert('Titolo, autore e ISBN sono obbligatori');
      return;
    }

    // Verifica che almeno una biblioteca sia selezionata
    const selectedLibraries = Object.entries(this.libraryBooksCopies)
      .filter(([_, copies]) => copies > 0)
      .map(([libId, copies]) => ({ 
        libraryId: parseInt(libId), 
        copies: parseInt(copies as any) 
      }));

    if (selectedLibraries.length === 0) {
      this.showAlert('Seleziona almeno una biblioteca');
      return;
    }

    this.isLoading = true;

    this.http.post(`${this.apiUrl}/library-books/add`, {
      book: this.newBook,
      libraryAssociations: selectedLibraries
    }).subscribe({
      next: () => {
        this.showAlert('Libro aggiunto con successo');
        this.bookAdded.emit();
        this.closeModal();
      },
      error: (err) => {
        this.showAlert('Errore nell\'aggiunta del libro: ' + err.error?.error);
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalController.dismiss({ bookAdded: true });
  }

  private showAlert(message: string) {
    alert(message);
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      category: '',
      description: '',
      cover_url: '',
      year: new Date().getFullYear()
    };
    this.libraryBooksCopies = {};
    this.libraries.forEach(lib => {
      this.libraryBooksCopies[lib.id] = 0;
    });
  }
}
