import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { UserProfile, UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs'; // To get UID easily

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() userProfile: UserProfile | undefined;
  editForm: FormGroup | undefined = undefined; // Initialize as undefined
  isLoading = false;
  userId: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private userDataService: UserDataService
  ) {}

  async ngOnInit() {
    // Get user ID once
    this.userId = await firstValueFrom(this.authService.getCurrentUserUid());

    // Initialize form - add Validators.required or others as needed
    this.editForm = this.fb.group({
      firstName: [this.userProfile?.firstName || '', Validators.required],
      lastName: [this.userProfile?.lastName || '', Validators.required],
      gender: [this.userProfile?.gender || ''],
      dateOfBirth: [this.userProfile?.dateOfBirth || ''], // Consider date pipe/input type later
      address: [this.userProfile?.address || ''],
      // Add phoneNumber form control
      phoneNumber: [this.userProfile?.phoneNumber || ''] // Add phone number, make it optional for now
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveChanges() {
    if (!this.editForm?.valid || !this.userId) {
      // Optionally show a toast for invalid form
      console.error('Form invalid or User ID missing');
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
      });
      await toast.present();
      this.modalCtrl.dismiss(updatedData, 'save');
    } catch (error) {
      console.error('Error updating profile:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to update profile. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
