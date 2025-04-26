import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface CartItem {
  id: string;
  name: string;
  localName: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);
  private currentUserId: string | null = null;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.currentUserId = user.uid;
          return this.loadCartFromFirestore(user.uid);
        } else {
          this.currentUserId = null;
          this.cartItems.next([]); 
          this.updateCartCount();
          return of(null); 
        }
      })
    ).subscribe();

    this.cartItems.subscribe(items => this.updateCartCount());
  }

  private updateCartCount() {
    this.cartItemCount.next(this.cartItems.value.length); 
    // Or use this for total quantity: 
    // this.cartItemCount.next(this.cartItems.value.reduce((count, item) => count + item.quantity, 0));
  }

  private loadCartFromFirestore(uid: string): Observable<CartItem[] | null> {
    console.log(`Loading cart for user: ${uid}`);
    return this.afs.doc<{ cart?: CartItem[] }>(`users/${uid}`).valueChanges().pipe(
      take(1), 
      tap(userData => {
        const cart = userData?.cart || [];
        console.log('Loaded cart from Firestore:', cart);
        this.cartItems.next(cart);
        // No need to call updateCartCount here, subscription handles it
      }),
      map(userData => userData?.cart || null)
    );
  }

  private saveCartToFirestore() {
    if (!this.currentUserId) {
      console.warn('Cannot save cart, no user logged in.');
      return; 
    }
    const cartData = this.cartItems.value;
    console.log(`Saving cart for user ${this.currentUserId}:`, cartData);
    const userDocRef = this.afs.doc(`users/${this.currentUserId}`);
    userDocRef.set({ cart: cartData }, { merge: true })
      .then(() => console.log('Cart successfully saved to Firestore'))
      .catch(error => console.error('Error saving cart to Firestore:', error));
  }

  getCartItems() {
    return this.cartItems.asObservable();
  }

  getCartItemsCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, item]);
    }
    this.saveCartToFirestore(); 
  }

  removeFromCart(itemId: string) {
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.id !== itemId));
    this.saveCartToFirestore(); 
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveCartToFirestore(); 
    }
  }

  updateCartItem(updatedItem: CartItem) {
    const currentItems = this.cartItems.getValue();
    const index = currentItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      currentItems[index] = updatedItem;
      this.cartItems.next([...currentItems]); 
      this.saveCartToFirestore(); 
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToFirestore(); 
  }

  getCartTotal() {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }
}
