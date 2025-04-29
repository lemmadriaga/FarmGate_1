import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  NavController,
  ToastController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink in template
import { Location } from '@angular/common';
@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.page.html',
  styleUrls: ['./under-construction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class UnderConstructionPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private location: Location,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  async notifyMe() {
    const alert = await this.alertCtrl.create({
      header: 'Get Notified',
      message:
        'Enter your email to receive an update when this feature is ready.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Your email address',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Subscribe',
          handler: async (data) => {
            if (data.email) {
    
              const toast = await this.toastCtrl.create({
                message: 'You will be notified when this feature is available!',
                duration: 2000,
                position: 'bottom',
                color: 'success',
              });
              toast.present();
              return true; 
            } else {
              const toast = await this.toastCtrl.create({
                message: 'Please enter a valid email address',
                duration: 2000,
                position: 'bottom',
                color: 'warning',
              });
              toast.present();
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  navigateTo(page: string) {
    switch (page) {
      case 'home':
        this.navCtrl.navigateRoot('user-dashboard/home');
        break;
      case 'buylokal':
        this.navCtrl.navigateForward('user-dashboard/buylokal-options');
        break;
      case 'marketplace':
        this.navCtrl.navigateForward('user-dashboard/marketplace');
        break;
      default:
        this.navCtrl.navigateRoot('/home');
    }
  }
}
