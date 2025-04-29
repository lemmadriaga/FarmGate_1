import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ModalController,
  ToastController,
  AnimationController,
} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  FeedbackReportPayload,
  UserDataService,
} from '../../services/user-data.service';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements OnInit {
  feedbackForm: FormGroup | undefined;
  isLoading = false;
  rating: number | null = null;
  userId: string | null = null;
  ratingDescriptions = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private userDataService: UserDataService,
    private animationCtrl: AnimationController
  ) {}

  async ngOnInit() {
    this.userId = await firstValueFrom(this.authService.getCurrentUserUid());

    this.feedbackForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1)]],
      comments: ['', [Validators.maxLength(500)]], // Optional but with max length
    });

    // Listen for form value changes
    this.feedbackForm.valueChanges.subscribe((values) => {
      // You could add additional logic here if needed
      console.log('Form values changed:', values);
    });
  }

  dismiss() {
    // Create a simple fade-out animation
    const animation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.feedback-container')!)
      .duration(200)
      .fromTo('opacity', '1', '0');

    // Play the animation and then dismiss
    animation.play().then(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  setRating(value: number) {
    // If clicking the same rating again, unselect it
    if (this.rating === value) {
      this.rating = null;
      this.feedbackForm?.patchValue({ rating: null });
    } else {
      this.rating = value;
      this.feedbackForm?.patchValue({ rating: value });
    }

    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50); // Light vibration
    }

    this.feedbackForm?.get('rating')?.updateValueAndValidity();
  }

  async submitFeedback() {
    if (!this.feedbackForm?.valid || !this.userId) {
      // Show a toast message if the rating is missing
      if (!this.feedbackForm?.get('rating')?.value) {
        const toast = await this.toastCtrl.create({
          message: 'Please select a star rating before submitting.',
          duration: 2000,
          color: 'warning',
          position: 'bottom',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
            },
          ],
        });
        toast.present();
      }
      return;
    }

    this.isLoading = true;
    const payload: FeedbackReportPayload = this.feedbackForm.value;

    try {
      await this.userDataService.submitFeedbackOrReport(
        this.userId,
        'feedback',
        payload
      );

      // Success animation and toast
      const toast = await this.toastCtrl.create({
        message: 'Thank you for your feedback!',
        duration: 2000,
        color: 'success',
        position: 'bottom',
        buttons: [
          {
            icon: 'checkmark-circle-outline',
            role: 'cancel',
          },
        ],
      });
      await toast.present();

      // Create a success animation
      const animation = this.animationCtrl
        .create()
        .addElement(document.querySelector('.feedback-container')!)
        .duration(300)
        .fromTo('transform', 'translateY(0)', 'translateY(-20px)')
        .fromTo('opacity', '1', '0');

      // Play the animation and then dismiss
      animation.play().then(() => {
        this.modalCtrl.dismiss(payload, 'submit');
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit feedback. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        buttons: [
          {
            text: 'Retry',
            handler: () => {
              // Give a slight delay before retrying
              setTimeout(() => this.submitFeedback(), 300);
            },
          },
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
