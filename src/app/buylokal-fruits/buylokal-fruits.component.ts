import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-buylokal-fruits',
  templateUrl: './buylokal-fruits.component.html',
  styleUrls: ['./buylokal-fruits.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalFruitsComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
