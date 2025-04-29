import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// Define an interface for the User data structure (optional but recommended)
export interface User {
  id?: string; // Optional: Firestore document ID
  firstName: string; // Add firstName
  lastName: string; // Add lastName
  email?: string;
  role: 'farmer' | 'regular'; // Use the specific roles
  // Add other relevant fields
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
  }

  // Method to get users by role
  getUsersByRole(role: 'farmer' | 'regular'): Observable<User[]> {
    // Query the collection, filtering by the 'role' field
    return this.afs.collection<User>('users', ref => ref.where('role', '==', role))
      .valueChanges({ idField: 'id' }); // Include document ID if needed
  }

  // You might want other methods here later, e.g., getUserById, updateUser, deleteUser
}
