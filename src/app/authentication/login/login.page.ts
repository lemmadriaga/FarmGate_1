import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  phoneNumber: string = '';
  mpin: string = '';
  showPassword = false;
  isLoading = false;
  loginForm!: FormGroup;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      mpin: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      duration: 2000,
      spinner: 'circular',
      cssClass: 'custom-loading',
    });
    await loading.present();

    // Simulate API call
    setTimeout(async () => {
      await loading.dismiss();
      this.isLoading = false;

      // Handle success or error here
      if (Math.random() > 0.3) {
        // Simulating successful login 70% of the time
        this.navCtrl.navigateRoot('/dashboard');
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Invalid credentials. Please try again.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [
            {
              text: 'Dismiss',
              role: 'cancel',
            },
          ],
        });
        await toast.present();
      }
    }, 2000);
  }

  goToSignUp() {
    this.navCtrl.navigateForward('./registration');
  }

  forgotMpin() {
    this.navCtrl.navigateForward('/forgot-mpin');
  }
}
