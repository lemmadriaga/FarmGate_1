import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserProfile, UserDataService } from '../../services/user-data.service'; 
import { AuthService } from '../../services/auth.service'; 
import { ModalController } from '@ionic/angular'; 
import { EditProfileModalComponent } from '../../modals/edit-profile/edit-profile-modal.component'; 
import { FeedbackModalComponent } from '../../modals/feedback-modal/feedback-modal.component'; 
import { ReportModalComponent } from '../../modals/report-modal/report-modal.component'; 
import { firstValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  userProfile$!: Observable<UserProfile | undefined>;

  constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.userProfile$ = this.authService.getCurrentUserUid().pipe(
      switchMap(uid => {
        if (uid) {
          return this.userDataService.getUserProfile(uid as string);
        } else {
          return new Observable<UserProfile | undefined>(observer => {
            observer.next(undefined);
            observer.complete();
          });
        }
      })
    );
  }

  async openEditModal() {
    const userProfileData = await firstValueFrom(this.userProfile$);

    if (!userProfileData) {
      console.error('User profile data not loaded yet.');
      return;
    }

    const modal = await this.modalCtrl.create({
      component: EditProfileModalComponent,
      componentProps: {
        userProfile: userProfileData
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save') {
      console.log('Profile saved:', data);
    }
  }

  async openFeedbackModal() {
    const modal = await this.modalCtrl.create({
      component: FeedbackModalComponent,
      // Add componentProps if needed to pass data
      // componentProps: {
      //   someData: 'value'
      // }
    });
    await modal.present();

    // Optional: Handle data returned from the modal on dismissal
    // const { data, role } = await modal.onDidDismiss();
    // if (role === 'submit') {
    //   console.log('Feedback submitted:', data);
    // }
  }

  async openReportModal() {
    const modal = await this.modalCtrl.create({
      component: ReportModalComponent,
      // Add componentProps if needed
    });
    await modal.present();

    // Optional: Handle data returned from the modal on dismissal
    // const { data, role } = await modal.onDidDismiss();
    // if (role === 'submit') {
    //   console.log('Report submitted:', data);
    // }
  }

}
