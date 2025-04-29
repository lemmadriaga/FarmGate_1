import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

import { UserProfile, UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';
import {
  switchMap,
  takeUntil,
  catchError,
  finalize,
  shareReplay,
  tap,
  filter,
} from 'rxjs/operators';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { EditProfileModalComponent } from '../../modals/edit-profile/edit-profile-modal.component';
import { FeedbackModalComponent } from '../../modals/feedback-modal/feedback-modal.component';
import { ReportModalComponent } from '../../modals/report-modal/report-modal.component';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit, OnDestroy {
  private userProfileSubject: BehaviorSubject<UserProfile | undefined> =
    new BehaviorSubject<UserProfile | undefined>(undefined);
  userProfile$!: Observable<UserProfile | undefined>;
  loading = true;
  error = false;

  // Trigger for unsubscribing from observables when component is destroyed
  private destroy$ = new Subject<void>();

  constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    this.initializeUserProfile();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeUserProfile() {
    this.loading = true;
    this.error = false;

    // First check if we have a valid user
    this.authService
      .getCurrentUserUid()
      .pipe(
        takeUntil(this.destroy$),
        tap((uid) => {
          if (!uid) {
            console.error('No user ID found');
            this.error = true;
            this.loading = false;
          }
        }),
        // Only proceed if we have a valid UID
        filter((uid) => !!uid),
        switchMap((uid) => {
          console.log('Fetching profile for UID:', uid);
          return this.userDataService.getUserProfile(uid as string).pipe(
            catchError((error) => {
              console.error('Error fetching user profile:', error);
              this.error = true;
              return of(undefined);
            })
          );
        }),
        // Use share replay to avoid multiple HTTP requests
        shareReplay(1)
      )
      .subscribe(
        (profile) => {
          console.log('Profile loaded:', profile);
          // Create a BehaviorSubject to properly expose the profile data
          if (!this.userProfileSubject) {
            this.userProfileSubject = new BehaviorSubject(profile);
          } else {
            this.userProfileSubject.next(profile);
          }
          this.loading = false;
        },
        (error) => {
          console.error('Subscription error:', error);
          this.error = true;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );

    // Expose the BehaviorSubject as an Observable
    this.userProfile$ = this.userProfileSubject.asObservable();
  }

  // Reload profile data
  refreshProfile() {
    this.initializeUserProfile();
  }

  async openEditModal() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading your profile...',
      spinner: 'circular',
    });
    await loader.present();

    try {
      const userProfileData = await firstValueFrom(this.userProfile$);

      if (!userProfileData) {
        throw new Error('User profile data not loaded');
      }

      await loader.dismiss();

      const modal = await this.modalCtrl.create({
        component: EditProfileModalComponent,
        componentProps: {
          userProfile: { ...userProfileData }, // Pass a copy to avoid unintended mutations
        },
        backdropDismiss: false,
        cssClass: 'profile-edit-modal',
      });

      // Add entrance animation
      modal.present().then(() => {
        this.animateModalEnter();
      });

      const { data, role } = await modal.onDidDismiss();

      if (role === 'save' && data) {
        // Reload the profile to show updated data
        this.refreshProfile();

        const toast = await this.toastCtrl.create({
          message: 'Profile updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'bottom',
          buttons: [{ text: 'OK', role: 'cancel' }],
        });
        await toast.present();
      }
    } catch (error) {
      await loader.dismiss();
      console.error('Error opening edit modal:', error);

      const toast = await this.toastCtrl.create({
        message: 'Could not load profile data. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async openFeedbackModal() {
    const modal = await this.modalCtrl.create({
      component: FeedbackModalComponent,
      cssClass: 'feedback-modal',
      componentProps: {
        // You can pass user info to pre-fill some fields
        userInfo: await firstValueFrom(this.userProfile$),
      },
      backdropDismiss: false,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'submit' && data) {
      const toast = await this.toastCtrl.create({
        message: 'Thank you for your feedback!',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async openReportModal() {
    const modal = await this.modalCtrl.create({
      component: ReportModalComponent,
      cssClass: 'report-modal',
      componentProps: {
        // Pass user info for context
        userInfo: await firstValueFrom(this.userProfile$),
      },
      backdropDismiss: false,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'submit' && data) {
      const toast = await this.toastCtrl.create({
        message:
          'Your report has been submitted. We will look into it shortly.',
        duration: 3000,
        color: 'primary',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Logging out...',
              spinner: 'circular',
            });
            await loading.present();

            try {
              await this.authService.logout();
              await loading.dismiss();
              this.router.navigateByUrl('/login', { replaceUrl: true });
            } catch (error) {
              await loading.dismiss();
              console.error('Error logging out:', error);

              const toast = await this.toastCtrl.create({
                message: 'Logout failed. Please try again.',
                duration: 3000,
                color: 'danger',
                position: 'bottom',
              });
              await toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Helper method to animate modal entrance
  private animateModalEnter() {
    const baseEl = document.querySelector('.profile-edit-modal');
    if (baseEl) {
      const animation = this.animationCtrl
        .create()
        .addElement(baseEl)
        .duration(300)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0)');

      animation.play();
    }
  }
}
