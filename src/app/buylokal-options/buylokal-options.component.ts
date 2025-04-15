import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-buylokal-options',
  templateUrl: './buylokal-options.component.html',
  styleUrls: ['./buylokal-options.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalOptionsComponent implements OnInit {
  options = [
    { title: 'Vegetables', route: '/buylokal-vegetables', image: 'assets/buylokal-vegetables.png' },
    { title: 'Fruits', route: '/buylokal-fruits', image: 'assets/buylokal-fruits.png' },
    { title: 'Dairy', route: '/buylokal-dairy', image: 'assets/buylokal-dairy.png' },
    { title: 'Livestock', route: '/buylokal-livestock', image: 'assets/buylokal-livestocks.png' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
