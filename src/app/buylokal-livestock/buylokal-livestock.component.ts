import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-buylokal-livestock',
  templateUrl: './buylokal-livestock.component.html',
  styleUrls: ['./buylokal-livestock.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalLivestockComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
