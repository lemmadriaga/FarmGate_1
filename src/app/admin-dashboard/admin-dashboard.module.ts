import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardPage } from './admin-dashboard.page';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';

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
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
      // Add other child routes (users, marketplace, etc.) here later
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
  declarations: [AdminDashboardPage, AdminOverviewComponent]
})
export class AdminDashboardPageModule {}
