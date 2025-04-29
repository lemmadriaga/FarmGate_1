import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  QueryFn,
} from '@angular/fire/compat/firestore';
import { Observable, from, of, throwError, BehaviorSubject } from 'rxjs';
import {
  map,
  catchError,
  tap,
  switchMap,
  shareReplay,
  retry,
} from 'rxjs/operators';
import firebase from 'firebase/compat/app';

import { Storage } from '@ionic/storage-angular';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/compat/auth';
export interface UserProfile {
  uid?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  role?: string;
  phoneNumber?: string;
  createdAt?: Date;
  photoURL?: string; // Added for profile pictures
  lastUpdated?: Date | firebase.firestore.Timestamp;
}

export interface FeedbackReport extends FeedbackReportPayload {
  id?: string;
  userId: string;
  type: 'feedback' | 'report';
  submittedAt: Date | firebase.firestore.Timestamp;
  status?: 'pending' | 'reviewed' | 'resolved';
}

export interface FeedbackReportPayload {
  rating?: number;
  comments?: string;
  reportDetails?: string;
  category?: string;
  contactBack?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private isOnline$ = new BehaviorSubject<boolean>(true);
  private cachedProfiles = new Map<string, UserProfile>();

  constructor(
    private afs: AngularFirestore,
    private storage: Storage,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
  ) {
    this.initializeStorage();
    this.setupNetworkListener();
  }

  private async initializeStorage() {
    await this.storage.create();
  }

  private async setupNetworkListener() {
    // Initial network status
    const status = await Network.getStatus();
    this.isOnline$.next(status.connected);

    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      this.isOnline$.next(status.connected);

      if (status.connected) {
        this.syncOfflineData();
        this.showNetworkToast('You are back online');
      } else {
        this.showNetworkToast(
          'You are offline. Changes will be saved when you reconnect.'
        );
      }
    });
  }

  private async showNetworkToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: this.isOnline$.value ? 'success' : 'warning',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });
    await toast.present();
  }

  private async syncOfflineData() {
    try {
      // Get pending updates from storage
      const pendingUpdates =
        (await this.storage.get('pendingProfileUpdates')) || [];

      // Process each pending update
      for (const update of pendingUpdates) {
        try {
          await this.afs
            .doc<UserProfile>(`users/${update.uid}`)
            .update(update.data);
        } catch (error) {
          console.error('Error syncing profile update:', error);
        }
      }

      // Clear pending updates
      await this.storage.remove('pendingProfileUpdates');

      // Sync pending feedback/reports
      const pendingFeedbackReports =
        (await this.storage.get('pendingFeedbackReports')) || [];

      for (const item of pendingFeedbackReports) {
        try {
          await this.afs.collection('feedbackAndReports').add(item);
        } catch (error) {
          console.error('Error syncing feedback/report:', error);
        }
      }

      await this.storage.remove('pendingFeedbackReports');
    } catch (error) {
      console.error('Error in syncOfflineData:', error);
    }
  }

  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    // Try to return from cache first
    if (this.cachedProfiles.has(uid)) {
      return of(this.cachedProfiles.get(uid));
    }

    return this.isOnline$.pipe(
      switchMap((isOnline) => {
        if (isOnline) {
          // Online - fetch from Firestore
          return this.afs
            .doc<UserProfile>(`users/${uid}`)
            .valueChanges({ idField: 'uid' })
            .pipe(
              tap((profile) => {
                if (profile) {
                  // Cache the profile
                  this.cachedProfiles.set(uid, profile);
                  // Store locally for offline access
                  this.storage.set(`userProfile_${uid}`, profile);
                }
              }),
              retry(3),
              catchError((error) => {
                console.error('Error fetching user profile:', error);
                // Try to get from local storage if online fetch fails
                return from(this.storage.get(`userProfile_${uid}`));
              }),
              shareReplay(1)
            );
        } else {
          // Offline - get from local storage
          return from(this.storage.get(`userProfile_${uid}`)).pipe(
            catchError((error) => {
              console.error('Error fetching user profile from storage:', error);
              return of(undefined);
            })
          );
        }
      })
    );
  }
  getCurrentUserUid(): Observable<string | null> {
    // If you're using AngularFire
    return this.afAuth.authState.pipe(map((user) => user?.uid || null));
  }

  async updateUserProfile(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    const updateData = {
      ...data,
      lastUpdated: new Date(),
    };

    // Update local cache immediately for responsive UI
    if (this.cachedProfiles.has(uid)) {
      const currentProfile = this.cachedProfiles.get(uid);
      this.cachedProfiles.set(uid, { ...currentProfile, ...updateData });
    }

    if (this.isOnline$.value) {
      // Online - update Firestore
      try {
        const userDoc = this.afs.doc<UserProfile>(`users/${uid}`);
        await userDoc.update(updateData);

        // Update local storage with the new data
        const currentData =
          (await this.storage.get(`userProfile_${uid}`)) || {};
        await this.storage.set(`userProfile_${uid}`, {
          ...currentData,
          ...updateData,
        });
      } catch (error) {
        console.error('Error updating user profile:', error);

        // Store the failed update for later sync
        await this.storeOfflineUpdate(uid, updateData);
        throw error;
      }
    } else {
      // Offline - store for later sync
      await this.storeOfflineUpdate(uid, updateData);

      // Update local storage with the new data too
      const currentData = (await this.storage.get(`userProfile_${uid}`)) || {};
      await this.storage.set(`userProfile_${uid}`, {
        ...currentData,
        ...updateData,
      });
    }
  }

  private async storeOfflineUpdate(uid: string, data: Partial<UserProfile>) {
    const pendingUpdates =
      (await this.storage.get('pendingProfileUpdates')) || [];
    pendingUpdates.push({ uid, data, timestamp: new Date().getTime() });
    await this.storage.set('pendingProfileUpdates', pendingUpdates);
  }

  async submitFeedbackOrReport(
    userId: string,
    type: 'feedback' | 'report',
    payload: FeedbackReportPayload
  ) {
    const data = {
      userId,
      type,
      ...payload,
      submittedAt: new Date(),
      status: 'pending',
    };

    if (this.isOnline$.value) {
      // Online - submit to Firestore
      try {
        return await this.afs.collection('feedbackAndReports').add(data);
      } catch (error) {
        console.error(`Error submitting ${type}:`, error);
        await this.storeOfflineFeedbackReport(data);
        throw error;
      }
    } else {
      // Offline - store for later
      await this.storeOfflineFeedbackReport(data);
      return { id: 'pending-' + new Date().getTime() }; // Return a temporary ID
    }
  }

  private async storeOfflineFeedbackReport(data: any) {
    const pendingItems =
      (await this.storage.get('pendingFeedbackReports')) || [];
    pendingItems.push(data);
    await this.storage.set('pendingFeedbackReports', pendingItems);
  }

  getLatestUsers(limitCount: number): Observable<UserProfile[]> {
    if (!this.isOnline$.value) {
      return of([]);
    }

    return this.afs
      .collection<UserProfile>('users', (ref) =>
        ref.orderBy('createdAt', 'desc').limit(limitCount)
      )
      .valueChanges({ idField: 'uid' })
      .pipe(
        catchError((error) => {
          console.error('Error fetching latest users:', error);
          return of([]);
        })
      );
  }

  getLatestFeedbackAndReports(
    limitCount: number
  ): Observable<FeedbackReport[]> {
    if (!this.isOnline$.value) {
      return of([]);
    }

    return this.afs
      .collection<FeedbackReport>('feedbackAndReports', (ref) =>
        ref.orderBy('submittedAt', 'desc').limit(limitCount)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((error) => {
          console.error('Error fetching feedback and reports:', error);
          return of([]);
        })
      );
  }

  // Helper to check network status (can be used in components)
  get isOnline(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  // Clear cache - useful for testing or logout
  clearCache() {
    this.cachedProfiles.clear();
  }

  // Upload profile picture
  async uploadProfilePicture(uid: string, file: File): Promise<string> {
    if (!this.isOnline$.value) {
      throw new Error('Cannot upload profile picture while offline');
    }

    try {
      // Implementation would depend on your file storage solution
      // This is a placeholder - you'd need to add actual Firebase Storage code

      // After successful upload, update the profile with the new image URL
      const photoURL = `https://your-storage-url/profiles/${uid}/${file.name}`;
      await this.updateUserProfile(uid, { photoURL });
      return photoURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Get user's feedback history
  getUserFeedbackHistory(userId: string): Observable<FeedbackReport[]> {
    if (!this.isOnline$.value) {
      return of([]);
    }

    return this.afs
      .collection<FeedbackReport>('feedbackAndReports', (ref) =>
        ref
          .where('userId', '==', userId)
          .where('type', '==', 'feedback')
          .orderBy('submittedAt', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((error) => {
          console.error('Error getting user feedback history:', error);
          return of([]);
        })
      );
  }

  // Get user's report history
  getUserReportHistory(userId: string): Observable<FeedbackReport[]> {
    if (!this.isOnline$.value) {
      return of([]);
    }

    return this.afs
      .collection<FeedbackReport>('feedbackAndReports', (ref) =>
        ref
          .where('userId', '==', userId)
          .where('type', '==', 'report')
          .orderBy('submittedAt', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        catchError((error) => {
          console.error('Error getting user report history:', error);
          return of([]);
        })
      );
  }
}
