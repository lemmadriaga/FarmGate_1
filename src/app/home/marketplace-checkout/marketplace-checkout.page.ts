import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { UserDataService, UserProfile } from '../../services/user-data.service'; 
import firebase from 'firebase/compat/app'; // Import firebase namespace for type

@Component({
  selector: 'app-marketplace-checkout',
  templateUrl: './marketplace-checkout.page.html',
  styleUrls: ['./marketplace-checkout.page.scss']
})
export class MarketplaceCheckoutPage implements OnInit, OnDestroy {

  cartItems$: Observable<CartItem[]>;
  currentCartItems: CartItem[] = []; 
  private cartSubscription!: Subscription;

  orderSubtotal: number = 0;
  deliveryFee: number = 50;
  discount: number = 0;
  finalTotal: number = 0;

  orderPlacedSuccessfully: boolean = false;

  userProfile: UserProfile | null = null;
  isLoadingProfile: boolean = true;
  private userAuthSubscription!: Subscription;
  private userProfileSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService, 
    private userDataService: UserDataService 
  ) { 
    this.cartItems$ = this.cartService.getCartItems(); 
  }

  ngOnInit() {
    this.cartSubscription = this.cartItems$.subscribe(items => {
      this.currentCartItems = items; 
      this.calculateTotals(items);
    });

    this.fetchUserProfile();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userAuthSubscription) {
      this.userAuthSubscription.unsubscribe(); 
    }
    if (this.userProfileSubscription) {
      this.userProfileSubscription.unsubscribe(); 
    }
  }

  fetchUserProfile() {
    this.isLoadingProfile = true;
    this.userAuthSubscription = this.authService.user$.pipe(
      take(1) 
    ).subscribe((user: firebase.User | null) => { 
      if (user && user.uid) {
        this.userProfileSubscription = this.userDataService.getUserProfile(user.uid).subscribe(
          profile => {
            this.userProfile = profile || null; 
            this.isLoadingProfile = false;
            console.log('User Profile:', this.userProfile);
          },
          error => {
            console.error('Error fetching user profile:', error);
            this.isLoadingProfile = false;
          }
        );
      } else {
        console.error('No authenticated user found.');
        this.isLoadingProfile = false;
      }
    });
  }

  calculateTotals(items: CartItem[]) {
    this.orderSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.finalTotal = this.orderSubtotal + this.deliveryFee - this.discount;
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      this.cartService.updateCartItem(updatedItem);
    } else {
    }
  }

  increaseQuantity(item: CartItem) {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    this.cartService.updateCartItem(updatedItem);
  }

  quantityChanged(item: CartItem, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newQuantity = parseInt(inputElement.value, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1; 
      inputElement.value = newQuantity.toString(); 
    }

    if (item.quantity !== newQuantity) {
      const updatedItem = { ...item, quantity: newQuantity };
      this.cartService.updateCartItem(updatedItem);
    }
  }

  placeOrder() {
    console.log('Placing order...');
    this.orderPlacedSuccessfully = true; 
    this.cartService.clearCart(); 

    setTimeout(() => {
      this.orderPlacedSuccessfully = false; 
      this.router.navigateByUrl('/home/marketplace');
    }, 5000); 
  }
}
