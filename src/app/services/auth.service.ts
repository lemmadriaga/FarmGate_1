import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Import firebase namespace if needed
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router for logout navigation

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable that emits the current user state (firebase.User | null)
  public readonly user$: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState; // Expose the authentication state
  }

  // Method to get the current user state once (useful for initial checks)
  // Returns a Promise that resolves with firebase.User | null
  getCurrentUser(): Promise<firebase.User | null> {
    return new Promise((resolve, reject) => {
      const subscription = this.user$.subscribe(user => {
        subscription.unsubscribe();
        resolve(user);
      }, reject);
    });
  }

  // Method to get the current user's UID as an Observable
  // Emits string | null
  getCurrentUserUid(): Observable<string | null> {
    return new Observable(observer => {
      const subscription = this.user$.subscribe(user => {
        observer.next(user ? user.uid : null);
      }, err => observer.error(err), () => observer.complete());
      // Return cleanup function
      return () => subscription.unsubscribe();
    });
  }

  // Example Logout method
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      // Redirect to login page after logout
      this.router.navigate(['/login']); // Or your desired logout destination
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error, maybe show a toast
    }
  }

  // You can add login methods here too if you want to centralize them,
  // but login.page.ts currently handles it directly.
  // async loginWithEmailPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
  //   return this.afAuth.signInWithEmailAndPassword(email, password);
  // }

}
