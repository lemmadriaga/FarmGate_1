import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmerDashboardPage } from './farmer-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: FarmerDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmerDashboardPageRoutingModule {}
