import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {
  // State for dropdowns
  openDropdown: string | null = null; // Holds the key of the currently open dropdown

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  // --- Dropdown Logic ---
  toggleDropdown(key: string) {
    this.openDropdown = this.openDropdown === key ? null : key;
  }

  isDropdownOpen(key: string): boolean {
    return this.openDropdown === key;
  }

  // --- Navigation ---
  navigateTo(route: string) {
    console.log(`Navigating to: ${route}`); // Log navigation intent
    this.router.navigate([route]);
    // Optionally close dropdown after navigation
    // this.openDropdown = null;
  }

  async adminLogout() {
    try {
      await this.authService.logout();
      // Navigate to login page after successful sign out
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error('Error logging out from admin:', error);
      const toast = await this.toastCtrl.create({
        message: 'Logout failed. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
