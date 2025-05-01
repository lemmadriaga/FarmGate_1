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

    // Filter out any potentially invalid items before saving
    const validCartData = this.cartItems.value.filter(item => this.validateCartItem(item));
    
    if (validCartData.length !== this.cartItems.value.length) {
      console.warn('Some cart items were invalid and will not be saved');
      // Update the cart items to only include valid items
      this.cartItems.next(validCartData);
    }

    // Only proceed if we have valid data
    if (validCartData.length === 0) {
      console.log('No valid cart items to save');
      return;
    }

    console.log(`Saving cart for user ${this.currentUserId}:`, validCartData);
    const userDocRef = this.afs.doc(`users/${this.currentUserId}`);
    
    // Ensure we're not saving any undefined values
    const cleanCartData = validCartData.map(item => ({
      id: item.id || '',
      name: item.name || '',
      localName: item.localName || '',
      price: typeof item.price === 'number' ? item.price : 0,
      quantity: typeof item.quantity === 'number' ? item.quantity : 0,
      image: item.image || ''
    }));

    userDocRef.set({ cart: cleanCartData }, { merge: true })
      .then(() => console.log('Cart successfully saved to Firestore'))
      .catch(error => console.error('Error saving cart to Firestore:', error));
  }

  getCartItems() {
    return this.cartItems.asObservable();
  }

  getCartItemsCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  private validateCartItem(item: CartItem): boolean {
    return !!(item &&
      item.id &&
      item.name &&
      item.localName &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      item.image);
  }

  addToCart(item: CartItem) {
    // Validate all required fields are present and not undefined
    if (!this.validateCartItem(item)) {
      console.error('Invalid cart item:', item);
      return;
    }

    // Clean the item before adding to cart
    const cleanItem: CartItem = {
      id: item.id,
      name: item.name,
      localName: item.localName,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image
    };

    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.id === cleanItem.id);

    if (existingItem) {
      existingItem.quantity += cleanItem.quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, cleanItem]);
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
    // Validate the updated item
    if (!this.validateCartItem(updatedItem)) {
      console.error('Invalid cart item update:', updatedItem);
      return;
    }

    // Clean the updated item
    const cleanItem: CartItem = {
      id: updatedItem.id,
      name: updatedItem.name,
      localName: updatedItem.localName,
      price: Number(updatedItem.price),
      quantity: Number(updatedItem.quantity),
      image: updatedItem.image
    };

    const currentItems = this.cartItems.getValue();
    const index = currentItems.findIndex(item => item.id === cleanItem.id);
    
    if (index !== -1) {
      currentItems[index] = cleanItem;
      this.cartItems.next([...currentItems]); 
      this.saveCartToFirestore(); 
    }
  }

  clearCart() {
    this.cartItems.next([]);
    // When clearing cart, we can safely set an empty array in Firestore
    if (this.currentUserId) {
      const userDocRef = this.afs.doc(`users/${this.currentUserId}`);
      userDocRef.set({ cart: [] }, { merge: true })
        .then(() => console.log('Cart successfully cleared in Firestore'))
        .catch(error => console.error('Error clearing cart in Firestore:', error));
    }
  }

  getCartTotal() {
    return this.cartItems.value.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return total + (quantity * price);
    }, 0);
  }
}
