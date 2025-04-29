import { Component, OnInit } from '@angular/core';
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
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {
  reportForm: FormGroup | undefined;
  isLoading = false;
  userId: string | null = null;
  helpTexts = {
    bug: 'Please describe what happened, steps to reproduce, and expected behavior.',
    content: 'Please specify the content in question and describe the issue.',
    other: 'Please provide as much detail as possible about your concern.',
  };

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

    this.reportForm = this.fb.group({
      category: ['bug', Validators.required], // Default to bug
      reportDetails: ['', [Validators.required, Validators.maxLength(500)]],
      allowContact: [false], // Optional preference for contact
    });

    // Listen for validation state changes
    this.reportForm.get('reportDetails')?.valueChanges.subscribe((value) => {
      // You could add additional validation logic here
      console.log('Details length:', value?.length || 0);
    });
  }

  dismiss() {
    // Create a simple fade-out animation
    const animation = this.animationCtrl
      .create()
      .addElement(document.querySelector('.report-container')!)
      .duration(200)
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'translateY(0)', 'translateY(10px)');

    // Play the animation and then dismiss
    animation.play().then(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  categoryChanged(event: any) {
    // You could perform actions when category changes
    console.log('Category changed to:', event.detail.value);

    // Clear focus from segment buttons
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  getHelpText(): string {
    const category = this.reportForm?.get('category')?.value || 'bug';
    return this.helpTexts[category as keyof typeof this.helpTexts];
  }

  getCharCount(): number {
    return this.reportForm?.get('reportDetails')?.value?.length || 0;
  }

  async submitReport() {
    if (!this.reportForm?.valid || !this.userId) {
      // Show a toast message if details are missing
      if (!this.reportForm?.get('reportDetails')?.value) {
        const toast = await this.toastCtrl.create({
          message: 'Please provide details for your report.',
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
    const payload: FeedbackReportPayload = this.reportForm.value;

    try {
      await this.userDataService.submitFeedbackOrReport(
        this.userId,
        'report',
        payload
      );

      // Success toast
      const toast = await this.toastCtrl.create({
        message: 'Your report has been submitted successfully.',
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
        .addElement(document.querySelector('.report-container')!)
        .duration(300)
        .fromTo('transform', 'translateY(0)', 'translateY(-20px)')
        .fromTo('opacity', '1', '0');

      // Play the animation and then dismiss
      animation.play().then(() => {
        this.modalCtrl.dismiss(payload, 'submit');
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit report. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        buttons: [
          {
            text: 'Retry',
            handler: () => {
              setTimeout(() => this.submitReport(), 300);
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
