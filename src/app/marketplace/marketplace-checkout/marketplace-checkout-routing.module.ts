import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketplaceCheckoutPage } from './marketplace-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceCheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceCheckoutPageRoutingModule {}
