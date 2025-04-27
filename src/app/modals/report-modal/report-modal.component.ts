import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FeedbackReportPayload, UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {

  reportForm: FormGroup | undefined;
  isLoading = false;
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

    this.reportForm = this.fb.group({
      // Report details are required
      reportDetails: ['', Validators.required]
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async submitReport() {
    if (!this.reportForm?.valid || !this.userId) {
      // Show a toast message if details are missing (form invalid)
      if (!this.reportForm?.get('reportDetails')?.value) {
        const toast = await this.toastCtrl.create({
         message: 'Report details are required.',
         duration: 2000,
         color: 'warning'
        });
        toast.present();
      }
      console.error('Form invalid or User ID missing. Report details required.');
      return;
    }

    this.isLoading = true;
    const payload: FeedbackReportPayload = this.reportForm.value;

    try {
      await this.userDataService.submitFeedbackOrReport(this.userId, 'report', payload);
      const toast = await this.toastCtrl.create({
        message: 'Report submitted successfully!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.modalCtrl.dismiss(payload, 'submit');
    } catch (error) {
      console.error('Error submitting report:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit report. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
