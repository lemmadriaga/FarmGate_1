import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartItem {
  id: string;
  name: string;
  localName: string;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor() { }

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
  }

  removeFromCart(itemId: string) {
    const currentItems = this.cartItems.value;
    this.cartItems.next(currentItems.filter(item => item.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getCartTotal() {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }
}
