import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertCtrl: AlertController) {}

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentConfirm(header: string, message: string, confirmText: string = 'Conferma', cancelText: string = 'Annulla'): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmText,
            handler: () => {
              resolve(true); 
            }
          }
        ]
      });
      await alert.present();
    });
  }
}