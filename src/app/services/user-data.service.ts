import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

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

// Define an interface for the Feedback/Report document structure
// (Assuming it includes fields from payload + metadata)
export interface FeedbackReport extends FeedbackReportPayload {
  id?: string; // Add if using valueChanges({ idField: 'id' })
  userId: string;
  type: 'feedback' | 'report';
  submittedAt: Date | firebase.firestore.Timestamp; // Allow both types
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

  // Get the latest registered users
  getLatestUsers(limitCount: number): Observable<UserProfile[]> {
    return this.afs.collection<UserProfile>('users', ref => ref
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
    ).valueChanges({ idField: 'uid' }); // Include document ID if needed
  }

  // Get the latest feedback and reports
  getLatestFeedbackAndReports(limitCount: number): Observable<FeedbackReport[]> {
    return this.afs.collection<FeedbackReport>('feedbackAndReports', ref => ref
      .orderBy('submittedAt', 'desc')
      .limit(limitCount)
    ).valueChanges({ idField: 'id' }); // Include document ID if needed
  }
}
