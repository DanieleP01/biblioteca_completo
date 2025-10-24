import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Library } from '../models/library.model.js';

@Component({
  selector: 'app-library-detail',
  templateUrl: './library-detail.page.html',
  styleUrls: ['./library-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})
export class LibraryDetailPage implements OnInit {
  library: Library | null = null;
  isLoading = true;
  isLoggedIn = false; //controller login

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); //prende l'id dalla route
    if(id) {
      this.loadLibraryDetails(id);
    } else {
      this.router.navigate(['home']);
    }
    this.checkLoginStatus();
  }

  loadLibraryDetails(id: String){
    this.isLoading = true;
    this.http.get<Library>(`http://localhost:3000/api/librerie/${id}`)
          .subscribe({
            next: (librerie) => {
              this.library = librerie;
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }
          });
  }

  checkLoginStatus(){
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

}
