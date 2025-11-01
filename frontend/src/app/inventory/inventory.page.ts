import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service.js';
import { inventoryBook } from '../models/inventory.model.js';
import { Book } from '../models/book.model.js';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class InventoryPage implements OnInit {
  inventoryBook: inventoryBook[] = [];
  currentUser: any;
  isLoading = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadLibraryBook();
  }

  loadLibraryBook(){
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/libraries/${this.currentUser.library_id}/books`).subscribe({
      next: (res) => {
        this.inventoryBook = res;
        console.log("Libri della biblioteca: ", this.inventoryBook);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

  requestCopies(book: Book){
    console.log("ciao");
  }

}
