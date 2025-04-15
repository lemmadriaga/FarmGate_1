import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BuylokalFruitsComponent } from './buylokal-fruits.component';

const routes: Routes = [
  {
    path: '',
    component: BuylokalFruitsComponent
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
export class BuylokalFruitsModule { }
