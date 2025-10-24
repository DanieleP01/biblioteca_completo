import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'book-detail/:id',
    loadComponent: () => import('./book-detail/book-detail.page').then( m => m.BookDetailPage)
  },
  {
    path: 'library-detail/:id',
    loadComponent: () => import('./library-detail/library-detail.page').then( m => m.LibraryDetailPage)
  },
];
