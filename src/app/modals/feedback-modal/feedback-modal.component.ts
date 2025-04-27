import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FeedbackReportPayload, UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements OnInit {

  feedbackForm: FormGroup | undefined;
  isLoading = false;
  rating: number | null = null; // To hold the current star rating visually
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private userDataService: UserDataService
  ) { }

  async ngOnInit() {
    this.userId = await firstValueFrom(this.authService.getCurrentUserUid());

    this.feedbackForm = this.fb.group({
      // Rating is required, minimum 1 star if they interact
      rating: [null, [Validators.required, Validators.min(1)]],
      comments: [''] // Comments are optional
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  setRating(value: number) {
    this.rating = value;
    // Patch the value into the form control
    this.feedbackForm?.patchValue({ rating: value });
    // Manually trigger validation update if needed, though patchValue often does
    this.feedbackForm?.get('rating')?.updateValueAndValidity();
  }

  async submitFeedback() {
    if (!this.feedbackForm?.valid || !this.userId) {
      // Show a toast message if the rating is missing (form invalid)
      if (!this.feedbackForm?.get('rating')?.value) {
         const toast = await this.toastCtrl.create({
          message: 'Please select a star rating.',
          duration: 2000,
          color: 'warning'
         });
         toast.present();
      }
      console.error('Form invalid or User ID missing. Rating required.');
      return;
    }

    this.isLoading = true;
    const payload: FeedbackReportPayload = this.feedbackForm.value;

    try {
      await this.userDataService.submitFeedbackOrReport(this.userId, 'feedback', payload);
      const toast = await this.toastCtrl.create({
        message: 'Feedback submitted successfully!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.modalCtrl.dismiss(payload, 'submit');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit feedback. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
