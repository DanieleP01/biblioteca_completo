import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-popover',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './user-popover.component.html'  
})

export class UserPopoverComponent {
  @Input() onLogout: () => void = () => {};
  username: string = '';

  isLibrarian = false;
  isUser = false;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthService,
    private alertController: AlertController
  ) {

    this.username = this.authService.getUser()?.username || '';
    console.log(this.username);
  }

  ngOnInit() {
    this.isLibrarian = this.authService.getUserRole() == 'librarian';
    this.isUser = this.authService.getUserRole() == 'user';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.popoverController.dismiss();
  }

  goToMyBooks() {
    this.router.navigate(['/my-books']);
    this.popoverController.dismiss();
  }

  goToMyLoansHistory(){
    this.router.navigate(['/loans-history']);
    this.popoverController.dismiss();
  }

  goToLoansLibrary(){
    this.router.navigate(['/loans-library']);
    this.popoverController.dismiss();
  }

  goToInventory(){
    this.router.navigate(['/inventory']);
    this.popoverController.dismiss();
  }

  // Alert di conferma prima del logout
  async confirmLogout() {
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Sei sicuro di voler effettuare il logout?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Conferma',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.onLogout();
    this.popoverController.dismiss();
    window.location.reload();
  }
}
