import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDashboardPage } from './user-dashboard.page';

const routes: Routes = [
  {
    path: 'educational-hub',
    loadChildren: () => import('./educational-hub/educational-hub.module').then( m => m.EducationalHubPageModule)
  },
  {
    path: '',
    component: UserDashboardPage, 
    children:[
      {
        path: 'home',
        loadChildren: () => import('../home.module').then( m => m.HomePageModule)
      },
      {
        path: 'marketplace',
        loadChildren: () => import('../marketplace/marketplace.module').then( m => m.MarketplacePageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'BuyLokal',
        loadChildren: () => import('../buylokal-options/buylokal-options.module').then( m => m.BuylokalOptionsModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../user-profile/user-profile.module').then( m => m.UserProfilePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboardPageRoutingModule {}
