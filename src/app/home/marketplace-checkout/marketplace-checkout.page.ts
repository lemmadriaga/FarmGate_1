import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
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
    private userDataService: UserDataService,
    private toastController: ToastController
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
    }
  }

  async increaseQuantity(item: CartItem) {
    // Get current cart items
    const currentItems = await firstValueFrom(this.cartItems$);

    // Calculate total kilos in cart
    const totalKilos = currentItems.reduce((sum: number, cartItem: CartItem) => {
      return sum + (cartItem.id === item.id ? cartItem.quantity + 1 : cartItem.quantity);
    }, 0);

    // Check if adding 1 more kilo exceeds the basket capacity
    if (totalKilos > 4) {
      const toast = await this.toastController.create({
        message: `Cannot add more items. One basket can only hold 4 kilos total.`,
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      toast.present();
      return;
    }

    // Update the item quantity
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    this.cartService.updateCartItem(updatedItem);
      
    // Show remaining capacity
    const remainingKilos = 4 - totalKilos;
    if (remainingKilos > 0) {
      const toast = await this.toastController.create({
        message: `You can add ${remainingKilos} more kilo${remainingKilos > 1 ? 's' : ''} in this basket`,
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
    }
  }

  async quantityChanged(item: CartItem, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newQuantity = parseInt(inputElement.value, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
      inputElement.value = newQuantity.toString();
    }

    // Get current cart items
    const currentItems = await firstValueFrom(this.cartItems$);

    // Calculate total kilos with the new quantity
    const totalKilos = currentItems.reduce((sum: number, cartItem: CartItem) => {
      return sum + (cartItem.id === item.id ? newQuantity : cartItem.quantity);
    }, 0);

    if (totalKilos > 4) {
      const toast = await this.toastController.create({
        message: `Cannot add ${newQuantity} kilos. One basket can only hold 4 kilos total.`,
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      toast.present();
      inputElement.value = item.quantity.toString();
      return;
    }

    // Update the item quantity
    if (item.quantity !== newQuantity) {
      const updatedItem = { ...item, quantity: newQuantity };
      this.cartService.updateCartItem(updatedItem);

      // Show remaining capacity
      const remainingKilos = 4 - totalKilos;
      if (remainingKilos >= 0) {
        const message = remainingKilos === 0 
          ? 'Basket is full (4 kilos)'
          : `You can add ${remainingKilos} more kilo${remainingKilos > 1 ? 's' : ''} in this basket`;
        const toast = await this.toastController.create({
          message,
          duration: 2000,
          position: 'bottom',
          color: remainingKilos === 0 ? 'warning' : 'success'
        });
        toast.present();
      }
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
