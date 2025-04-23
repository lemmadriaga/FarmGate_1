import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MarketplaceCheckoutPageRoutingModule } from './marketplace-checkout-routing.module';
import { MarketplaceCheckoutPage } from './marketplace-checkout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplaceCheckoutPageRoutingModule
  ],
  declarations: [MarketplaceCheckoutPage]
})
export class MarketplaceCheckoutPageModule {}
