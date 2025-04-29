import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ensure ReactiveFormsModule is here
import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';
import { UserProfilePage } from './user-profile.page';
import { EditProfileModalComponent } from '../../modals/edit-profile/edit-profile-modal.component';
import { FeedbackModalComponent } from '../../modals/feedback-modal/feedback-modal.component'; // Import Feedback Modal
import { ReportModalComponent } from '../../modals/report-modal/report-modal.component'; // Import Report Modal

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    ReactiveFormsModule 
  ],
  declarations: [
    UserProfilePage,
    EditProfileModalComponent,
    FeedbackModalComponent, 
    ReportModalComponent 
  ]
})
export class UserProfilePageModule {}
