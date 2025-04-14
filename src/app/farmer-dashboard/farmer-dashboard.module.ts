import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmerDashboardPageRoutingModule } from './farmer-dashboard-routing.module';

import { FarmerDashboardPage } from './farmer-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmerDashboardPageRoutingModule
  ],
  declarations: [FarmerDashboardPage]
})
export class FarmerDashboardPageModule {}
