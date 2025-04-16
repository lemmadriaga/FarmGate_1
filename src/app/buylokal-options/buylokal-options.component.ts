import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buylokal-options',
  templateUrl: './buylokal-options.component.html',
  styleUrls: ['./buylokal-options.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalOptionsComponent implements OnInit {
  searchTerm: string = '';
  filteredOptions = [
    { title: 'Vegetables', route: '/buylokal-vegetables', image: 'assets/buylokal-vegetables.png' },
    { title: 'Fruits', route: '/buylokal-fruits', image: 'assets/buylokal-fruits.png' },
    { title: 'Dairy', route: '/buylokal-dairy', image: 'assets/buylokal-dairy.png' },
    { title: 'Livestock', route: '/buylokal-livestock', image: 'assets/buylokal-livestocks.png' }
  ];
  private readonly allOptions = [
    { title: 'Vegetables', route: '/buylokal-vegetables', image: 'assets/buylokal-vegetables.png' },
    { title: 'Fruits', route: '/buylokal-fruits', image: 'assets/buylokal-fruits.png' },
    { title: 'Dairy', route: '/buylokal-dairy', image: 'assets/buylokal-dairy.png' },
    { title: 'Livestock', route: '/buylokal-livestock', image: 'assets/buylokal-livestocks.png' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.filteredOptions = [...this.allOptions];
  }

  onSearch(event: any) {
    const searchTerm = event?.target?.value?.toLowerCase() || '';
    this.filteredOptions = this.allOptions.filter(option =>
      option.title.toLowerCase().includes(searchTerm)
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
