import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NewBook } from 'src/app/models/book.model';
import { Library } from 'src/app/models/library.model';
import { AlertService } from 'src/app/services/alert.service';

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
    content_path: '',
    year: new Date().getFullYear()
  };

  libraries: Library[] = [];
  libraryBooksCopies: { [key: number]: number } = {};
  isLoading = false;
  selectedFile: File | null = null; 

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLibraries();
  }

  //carica le librerire
  loadLibraries() {
    this.http.get<any>(`${this.apiUrl}/libraries`).subscribe({
      next: (res) => {
        this.libraries = res;
        this.libraryBooksCopies = {};
        this.libraries.forEach(lib => {
            this.libraryBooksCopies[lib.id] = 0;
        });
      },
      error: () => {
        this.alertService.presentAlert('Errore', 'Errore nel caricamento delle biblioteche');
      }
    });
  }

  //gestione selezione file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/plain') {
        this.alertService.presentAlert('Errore', 'Seleziona un file .txt');
        return;
      }
      this.selectedFile = file;
    }
  }

  private isFieldEmpty(value: any): boolean {
    return !value || (typeof value === 'string' && !value.trim());
  }

  //salva un nuovo libro
  saveNewBook() {
    // Valida i campi obbligatori
    const emptyFields = Object.values(this.newBook).filter(field => this.isFieldEmpty(field));
    if (emptyFields.length < 0) {
        this.alertService.presentAlert('Errore', 'Compila tutti i campi obbligatori');
        return;
    }

    // Valida file
    if (!this.selectedFile) {
      this.alertService.presentAlert('Errore', 'Carica il file del libro');
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
      this.alertService.presentAlert('Errore',' Seleziona almeno una biblioteca');
      return;
    }

    this.isLoading = true;

    // CREA FormData CON FILE 
    const formData = new FormData();
    
    formData.append('file', this.selectedFile);
    formData.append('book', JSON.stringify(this.newBook));
    formData.append('libraryAssociations', JSON.stringify(selectedLibraries));

    this.http.post(`${this.apiUrl}/library-books/add`, formData)
    .subscribe({
      next: () => {
        this.alertService.presentAlert('Successo', 'Libro aggiunto con successo');
        this.bookAdded.emit();
        this.closeModal();
      },
      error: (err) => {
        this.alertService.presentAlert('Errore', 'Errore nell\'aggiunta del libro: ' + err.error?.error);
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.modalController.dismiss({ bookAdded: true });
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      category: '',
      description: '',
      cover_url: '',
      content_path: '',
      year: new Date().getFullYear()
    };
    this.libraryBooksCopies = {};
    this.libraries.forEach(lib => {
      this.libraryBooksCopies[lib.id] = 0;
    });
  }
}
