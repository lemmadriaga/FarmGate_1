import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink in template

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.page.html',
  styleUrls: ['./under-construction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // Include IonicModule, CommonModule, RouterModule
})
export class UnderConstructionPage {

  constructor(private navCtrl: NavController) { }

  goBack() {
    this.navCtrl.back(); // Use NavController to go back
  }

}
