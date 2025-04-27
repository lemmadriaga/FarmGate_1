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
    ReactiveFormsModule // Ensure ReactiveFormsModule is imported
  ],
  declarations: [
    UserProfilePage,
    EditProfileModalComponent,
    FeedbackModalComponent, // Declare Feedback Modal
    ReportModalComponent // Declare Report Modal
  ]
})
export class UserProfilePageModule {}
