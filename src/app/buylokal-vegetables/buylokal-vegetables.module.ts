import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BuylokalVegetablesComponent } from './buylokal-vegetables.component';

const routes: Routes = [
  {
    path: '',
    component: BuylokalVegetablesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BuylokalVegetablesModule { }
