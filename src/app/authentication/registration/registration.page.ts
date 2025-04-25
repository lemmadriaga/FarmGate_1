import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  standalone: false,
})
export class RegistrationPage implements OnInit {
  registrationForm!: FormGroup; 
  showPassword = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmpassword: ['', Validators.required],
        address: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmpassword'),
      }
    );
  }

  get f() {
    return this.registrationForm.controls;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  async onRegister() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating your account...',
      duration: 2000,
      spinner: 'circular',
      cssClass: 'custom-loading',
    });
    await loading.present();

    const { firstName, lastName, email, password, address } =
      this.registrationForm.value;

    try {
      const userCredential = await this.authService.registerUser(
        email,
        password
      );
      const uid = userCredential.user?.uid;

      if (uid) {

        runInInjectionContext(this.injector, async () => {
          try {
            await this.firestore.collection('users').doc(uid).set({
              uid,
              firstName,
              lastName,
              email,
              address,
              createdAt: new Date(),
              role: 'regular',
            });
            await loading.dismiss();
            this.presentToast('Registration successful!', 'success');
            this.navCtrl.navigateRoot('user-dashboard/home')
          } catch (firestoreError) {
            console.error('Firestore error:', firestoreError);
            await loading.dismiss();
            this.presentToast(
              'Failed to save user data to Firestore.',
              'danger'
            );
          }
        });
      }
    } catch (error: any) {
      await loading.dismiss();
      this.presentToast(error.message, 'danger');
    }
  }


  goToLogin() {
    this.navCtrl.navigateBack('login');
  }
}
