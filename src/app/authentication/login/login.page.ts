import { Component, OnInit, NgZone } from '@angular/core'; // Import NgZone
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface User {
  role: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword = false;
  isLoading = false;
  loginForm!: FormGroup;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone 
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin(event: Event) {
    event.preventDefault();

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log('Trying to log in with:', email, password);

    if (!this.loginForm.valid) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter a valid email and password.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in...',
      });
      await loading.present();

      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user?.uid;

      if (!uid) {
        throw new Error('No UID found.');
      }

      const userDocSnapshot = await firstValueFrom(
        this.afs.doc(`users/${uid}`).get()
      );

      if (!userDocSnapshot.exists) {
        throw new Error('User document does not exist.');
      }

      const userRole = (userDocSnapshot.data() as { role: string })?.role;
      console.log('User role:', userRole);

      await loading.dismiss();

      if (userRole === 'farmer') {
        this.ngZone.run(() => this.router.navigate(['/farmer-dashboard']));
      } else if (userRole === 'admin') {
        this.ngZone.run(() => this.router.navigate(['/admin-dashboard']));
      } else if (userRole === 'regular') {
        this.ngZone.run(() => this.router.navigate(['user-dashboard/home']));
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Invalid user role.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      }
    } catch (error: any) {
      console.error('Login error:', error);

      const toast = await this.toastCtrl.create({
        message: `Login failed: ${error.message || error}`,
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  forgotpassword() {}
  goToSignUp() {
    this.navCtrl.navigateRoot('registration');
  }
}
