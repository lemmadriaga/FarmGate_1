import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceCheckoutPage } from './marketplace-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceCheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    // No need to import MarketplaceCheckoutPage here since it's standalone
  ],
  // No declarations needed for standalone components
})
export class MarketplaceCheckoutPageModule {}