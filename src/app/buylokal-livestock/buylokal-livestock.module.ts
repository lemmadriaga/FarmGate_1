import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BuylokalLivestockComponent } from './buylokal-livestock.component';

const routes: Routes = [
  {
    path: '',
    component: BuylokalLivestockComponent
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
export class BuylokalLivestockModule { }
