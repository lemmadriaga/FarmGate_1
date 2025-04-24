import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AdminDashboardPage } from './admin-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminDashboardPage,
      },
    ]),
    AdminDashboardPage, // Import instead of declaring if component is standalone
  ],
  // Remove declarations since component is standalone
})
export class AdminDashboardPageModule {}
