import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';


export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {

      return;
    }

 
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: false
})
export class RegistrationPage implements OnInit {
  registrationForm!: FormGroup; // Added non-null assertion operator
  showPassword = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        mpin: ['', [Validators.required, Validators.minLength(4)]],
        confirmMpin: ['', Validators.required],
        address: ['', Validators.required],
      },
      {
        validator: MustMatch('mpin', 'confirmMpin'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      // scroll to first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    // Show loading spinner
    const loading = await this.loadingCtrl.create({
      message: 'Creating your account...',
      duration: 2000,
      spinner: 'circular',
      cssClass: 'custom-loading',
    });
    await loading.present();

    // Form is valid, simulate API call
    setTimeout(async () => {
      await loading.dismiss();

      // Simulate successful registration
      if (Math.random() > 0.2) {
        // 80% success rate for demo
        const toast = await this.toastCtrl.create({
          message: 'Registration successful! You can now log in.',
          duration: 3000,
          position: 'bottom',
          color: 'success',
          buttons: [{ text: 'OK', role: 'cancel' }],
        });
        await toast.present();

        this.navCtrl.navigateRoot('/login');
      } else {
        // Handle error
        const toast = await this.toastCtrl.create({
          message: 'Registration failed. Please try again.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [{ text: 'OK', role: 'cancel' }],
        });
        await toast.present();
      }
    }, 2000);
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
