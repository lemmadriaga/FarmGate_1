import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { UserProfile, UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() userProfile: UserProfile | undefined;
  editForm: FormGroup | undefined = undefined;
  isLoading = false;
  userId: string | null = null;

  // For date formatting
  dateValue: string = '';

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private userDataService: UserDataService
  ) {}

  async ngOnInit() {
    // Get user ID once
    this.userId = await firstValueFrom(this.authService.getCurrentUserUid());

    // Initialize form with validators
    this.editForm = this.fb.group({
      firstName: [
        this.userProfile?.firstName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        this.userProfile?.lastName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      gender: [this.userProfile?.gender || ''],
      dateOfBirth: [this.userProfile?.dateOfBirth || ''],
      address: [this.userProfile?.address || ''],
      phoneNumber: [
        this.userProfile?.phoneNumber || '',
        [
          Validators.pattern(
            '^[+]?[(]?[0-9]{1,4}[)]?[-s.]?[0-9]{1,4}[-s.]?[0-9]{1,9}$'
          ),
        ],
      ],
    });

    // Format date for display if available
    if (this.userProfile?.dateOfBirth) {
      this.dateValue = this.userProfile.dateOfBirth;
    }
  }

  // Update hidden form field when date is changed
  updateDateOfBirth(event: any) {
    const selectedDate = event.detail.value;
    this.editForm?.get('dateOfBirth')?.setValue(selectedDate);
  }

  async dismiss() {
    // Show confirmation only if form has changes
    if (this.editForm?.dirty) {
      const alert = await this.alertCtrl.create({
        header: 'Discard Changes?',
        message:
          'You have unsaved changes. Are you sure you want to discard them?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Discard',
            handler: () => {
              this.modalCtrl.dismiss(null, 'cancel');
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.modalCtrl.dismiss(null, 'cancel');
    }
  }

  async saveChanges() {
    if (!this.editForm?.valid || !this.userId) {
      // Show validation errors
      this.markFormGroupTouched(this.editForm);

      const toast = await this.toastCtrl.create({
        message: 'Please fill in all required fields correctly.',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      await toast.present();
      return;
    }

    this.isLoading = true;
    const updatedData = this.editForm.value;

    try {
      await this.userDataService.updateUserProfile(this.userId, updatedData);
      const toast = await this.toastCtrl.create({
        message: 'Profile updated successfully!',
        duration: 2000,
        color: 'success',
        position: 'top',
      });
      await toast.present();
      this.modalCtrl.dismiss(updatedData, 'save');
    } catch (error) {
      console.error('Error updating profile:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to update profile. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  // Helper function to mark all controls as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup | undefined) {
    if (!formGroup) return;

    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Handle profile image selection (placeholder function)
  async selectProfileImage() {
    // Implement image selection functionality here
    // This could open a camera or file picker
    console.log('Profile image selection clicked');
  }
}
