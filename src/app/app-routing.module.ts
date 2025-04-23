import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardPageModule
      ),
  },
  {
    path: 'user-dashboard',
    loadChildren: () =>
      import('./user-dashboard/user-dashboard.module').then(
        (m) => m.UserDashboardPageModule
      ),
  },
  {
    path: 'farmer-dashboard',
    loadChildren: () =>
      import('./farmer-dashboard/farmer-dashboard.module').then(
        (m) => m.FarmerDashboardPageModule
      ),
  },
  {
    path: 'buylokal-options',
    loadChildren: () =>
      import('./buylokal-options/buylokal-options.module').then(
        (m) => m.BuylokalOptionsModule
      ),
  },
  {
    path: 'buylokal-vegetables',
    loadChildren: () =>
      import('./buylokal-vegetables/buylokal-vegetables.module').then(
        (m) => m.BuylokalVegetablesModule
      ),
  },
  {
    path: 'buylokal-fruits',
    loadChildren: () =>
      import('./buylokal-fruits/buylokal-fruits.module').then(
        (m) => m.BuylokalFruitsModule
      ),
  },
  {
    path: 'buylokal-dairy',
    loadChildren: () =>
      import('./buylokal-dairy/buylokal-dairy.module').then(
        (m) => m.BuylokalDairyModule
      ),
  },
  {
    path: 'buylokal-livestock',
    loadChildren: () =>
      import('./buylokal-livestock/buylokal-livestock.module').then(
        (m) => m.BuylokalLivestockModule
      ),
  },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./marketplace/marketplace.module').then(
        (m) => m.MarketplacePageModule
      ),
  },
  {
    path: 'marketplace-checkout',
    // Load the standalone component directly
    loadComponent: () =>
      import('./marketplace/marketplace-checkout/marketplace-checkout.page').then(
        (m) => m.MarketplaceCheckoutPage
      ),
  },
  {
    path: 'marketplace/category-products/:categoryLabel',
    loadChildren: () =>
      import('./marketplace/category-products/category-products.module').then(
        (m) => m.CategoryProductsPageModule
      ),
  },
  {
    path: 'category-products',
    loadChildren: () => import('./marketplace/category-products/category-products.module').then( m => m.CategoryProductsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
