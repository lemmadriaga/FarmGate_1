import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardPage } from './admin-dashboard.page';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { FarmerListComponent } from './users/farmer-list/farmer-list.component';
import { CustomerListComponent } from './users/customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardPage,
    children: [
      {
        path: 'overview',
        component: AdminOverviewComponent
      },
      {
        path: 'users/farmers',
        component: FarmerListComponent
      },
      {
        path: 'users/customers',
        component: CustomerListComponent
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
      // Add other child routes (marketplace, etc.) here later
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDashboardPage, AdminOverviewComponent, FarmerListComponent, CustomerListComponent]
})
export class AdminDashboardPageModule {}
