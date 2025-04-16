import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MarketplacePage } from './marketplace.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplacePage,
    RouterModule.forChild([{ path: '', component: MarketplacePage }])
  ]
})
export class MarketplacePageModule {}