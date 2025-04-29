import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserDataService, UserProfile } from '../../services/user-data.service';

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
    private router: Router,
    private userDataService: UserDataService
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

  async login() {
    if (this.loginForm.invalid) {
      this.presentToast('Please enter valid email and password.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    const { email, password } = this.loginForm.value;

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        // Get user profile to check role
        try {
          // Use firstValueFrom to get the profile data once
          const userProfile = await firstValueFrom(
            this.userDataService.getUserProfile(user.uid)
          ) as UserProfile | undefined;

          if (userProfile && userProfile.role === 'admin') {
            // Admin user, navigate to admin dashboard
            this.router.navigateByUrl('/admin-dashboard', { replaceUrl: true });
          } else {
            // Regular user or profile not found/no role, navigate to user dashboard
            // Ensure the path matches your routing setup
            this.router.navigateByUrl('/home/user-dashboard', { replaceUrl: true });
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          this.presentToast(
            'Login successful, but failed to retrieve user role. Proceeding to default dashboard.',
            'warning'
          );
          // Fallback navigation if profile fetch fails
          this.router.navigateByUrl('/home/user-dashboard', { replaceUrl: true });
        }
      } else {
        // Should not happen if signInWithEmailAndPassword succeeded, but handle defensively
        throw new Error('User authentication failed unexpectedly.');
      }
    } catch (error: any) {
      console.error('Login Error:', error);

      let errorMessage = 'Login failed. Please check your credentials.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      this.presentToast(errorMessage, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async presentToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }

  forgotpassword() {}

  goToSignUp() {
    this.router.navigate(['/registration']); 
  }

  async adminInfoClick() {
    console.log('Admin info link clicked');
    // Optionally navigate to a dedicated admin login if preferred:
    // this.router.navigate(['/admin-login']);
    await this.presentToast('Please use your Admin credentials in the fields above.', 'primary');
  }
}
