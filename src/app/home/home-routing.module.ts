import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./marketplace/marketplace.module').then( m => m.MarketplacePageModule)
  },
  {
    path: 'marketplace/category-products/:categoryLabel',
    loadChildren: () => import('./category-products/category-products.module').then( m => m.CategoryProductsPageModule)
  },
  {
    path: 'marketplace-checkout',
    loadChildren: () => import('./marketplace-checkout/marketplace-checkout.module').then(m => m.MarketplaceCheckoutPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
