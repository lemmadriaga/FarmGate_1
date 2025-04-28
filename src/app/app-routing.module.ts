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
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/login/login.module').then(
        (m) => m.LoginPageModule
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
      import('./home/user-dashboard/user-dashboard.module').then(
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
      import('./home/buylokal-options/buylokal-options.module').then(
        (m) => m.BuylokalOptionsModule
      ),
  },
  {
    path: 'buylokal-vegetables',
    loadChildren: () =>
      import('./home/buylokal-vegetables/buylokal-vegetables.module').then(
        (m) => m.BuylokalVegetablesModule
      ),
  },
  {
    path: 'buylokal-fruits',
    loadChildren: () =>
      import('./home/buylokal-fruits/buylokal-fruits.module').then(
        (m) => m.BuylokalFruitsModule
      ),
  },
  {
    path: 'buylokal-dairy',
    loadChildren: () =>
      import('./home/buylokal-dairy/buylokal-dairy.module').then(
        (m) => m.BuylokalDairyModule
      ),
  },
  {
    path: 'buylokal-livestock',
    loadChildren: () =>
      import('./home/buylokal-livestock/buylokal-livestock.module').then(
        (m) => m.BuylokalLivestockModule
      ),
  },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./home/marketplace/marketplace.module').then(
        (m) => m.MarketplacePageModule
      ),
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./authentication/registration/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./home/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./home/cart/cart.module').then( m => m.CartPageModule)
  },

  {
    path: 'under-construction',
    // Corrected to use loadComponent for standalone page
    loadComponent: () => import('./under-construction/under-construction.page').then( m => m.UnderConstructionPage)
  },
  {
    path: 'user-dashboard/educational-hub',
    loadChildren: () =>
      import('./home/user-dashboard/educational-hub/educational-hub.module').then(
        (m) => m.EducationalHubPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
