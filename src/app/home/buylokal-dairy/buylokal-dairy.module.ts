import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BuylokalDairyComponent } from './buylokal-dairy.component';

const routes: Routes = [
  {
    path: '',
    component: BuylokalDairyComponent
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
export class BuylokalDairyModule { }
