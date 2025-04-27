import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// Define an interface for the user profile data structure
export interface UserProfile {
  uid?: string; // Optional because it's added via valueChanges({ idField: 'uid' })
  email?: string; // Keep email if it exists
  firstName?: string; 
  lastName?: string; 
  address?: string;
  role?: string; // Keep role if it exists
  phoneNumber?: string; // Added back as optional
  createdAt?: any; // Keep createdAt if it exists (use firebase.firestore.Timestamp if preferred)
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private afs: AngularFirestore) { }

  // Get a user's profile document based on UID
  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    const userDoc: AngularFirestoreDocument<UserProfile> = this.afs.doc<UserProfile>(`users/${uid}`);
    return userDoc.valueChanges({ idField: 'uid' }); // Use valueChanges to get Observable
  }

  // Add other methods if needed (e.g., updateUserProfile)
}
