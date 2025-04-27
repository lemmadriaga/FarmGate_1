import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// Define an interface for the user profile data structure
export interface UserProfile {
  uid?: string; // Optional because it's added via valueChanges({ idField: 'uid' })
  email?: string; // Keep email if it exists
  firstName?: string; 
  lastName?: string; 
  gender?: string; // Added field
  dateOfBirth?: string; // Added field (Consider using Date or Timestamp type)
  address?: string;
  role?: string; // Keep role if it exists
  phoneNumber?: string; // Added back as optional
  createdAt?: Date;
}

export interface FeedbackReportPayload {
  rating?: number; // For feedback
  comments?: string; // For feedback
  reportDetails?: string; // For report
  // Add any other common or specific fields needed
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

  // Update a user's profile document
  updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userDoc: AngularFirestoreDocument<UserProfile> = this.afs.doc<UserProfile>(`users/${uid}`);
    // Use update to only change specified fields
    return userDoc.update(data);
  }

  // Submit feedback or a report using the AngularFire service
  submitFeedbackOrReport(userId: string, type: 'feedback' | 'report', payload: FeedbackReportPayload) {
    // Use the AngularFire service's collection method
    const collectionRef = this.afs.collection('feedbackAndReports');
    return collectionRef.add({
      userId: userId,
      type: type,
      ...payload, // Spread the specific feedback/report data
      submittedAt: new Date()
    });
  }
}
