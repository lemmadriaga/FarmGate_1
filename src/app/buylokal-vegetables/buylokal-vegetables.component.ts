import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buylokal-vegetables',
  templateUrl: './buylokal-vegetables.component.html',
  styleUrls: ['./buylokal-vegetables.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalVegetablesComponent implements OnInit {
  searchTerm: string = '';

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    // TODO: Implement search functionality
  }

  constructor() { }

  ngOnInit() { }
}
