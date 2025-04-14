import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { RegistrationPageModule } from '../registration/registration.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }, 
  {
    path: 'authentication',
    loadChildren: () =>
    RegistrationPageModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
