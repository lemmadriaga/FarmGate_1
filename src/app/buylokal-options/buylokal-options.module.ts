import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BuylokalOptionsComponent } from './buylokal-options.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: BuylokalOptionsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class BuylokalOptionsModule { }