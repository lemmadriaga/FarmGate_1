import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-buylokal-vegetables',
  templateUrl: './buylokal-vegetables.component.html',
  styleUrls: ['./buylokal-vegetables.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalVegetablesComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
