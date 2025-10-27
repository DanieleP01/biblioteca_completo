import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-popover',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './login-popover.component.html' 
})

export class LoginPopoverComponent {
  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
    this.popoverController.dismiss();
  }

  goToRegister() {
    this.router.navigate(['/registration']);
    this.popoverController.dismiss();
  }
}
