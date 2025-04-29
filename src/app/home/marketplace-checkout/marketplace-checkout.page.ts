import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import {
  Observable,
  Subscription,
  firstValueFrom,
  BehaviorSubject,
  of,
} from 'rxjs';
import { switchMap, take, catchError, finalize, tap } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserDataService, UserProfile } from '../../services/user-data.service';
import { OrderService } from '../../services/order.service';
import { AnimationController } from '@ionic/angular';
import firebase from 'firebase/compat/app';

interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  address: string;
  paymentMethod: string;
  orderId?: string;
  orderDate?: Date;
  estimatedDelivery?: Date;
}

@Component({
  selector: 'app-marketplace-checkout',
  templateUrl: './marketplace-checkout.page.html',
  styleUrls: ['./marketplace-checkout.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, ReactiveFormsModule],
})
export class MarketplaceCheckoutPage implements OnInit, OnDestroy {
  cartItems$: Observable<CartItem[]>;
  currentCartItems: CartItem[] = [];
  private cartSubscription!: Subscription;

  orderSubtotal: number = 0;
  deliveryFee: number = 50;
  discount: number = 0;
  finalTotal: number = 0;

  // Track multiple order states
  orderState: 'shopping' | 'processing' | 'confirmed' | 'failed' = 'shopping';
  orderSummary: OrderSummary | null = null;
  orderId: string = '';

  // Payment methods
  availablePaymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
    { id: 'gcash', name: 'GCash', icon: 'wallet-outline' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
  ];
  selectedPaymentMethod: string = 'cash';

  userProfile: UserProfile | null = null;
  isLoadingProfile: boolean = true;
  addressForm: FormGroup;
  editingAddress: boolean = false;

  private userAuthSubscription!: Subscription;
  private userProfileSubscription!: Subscription;

  // Basket capacity constraints
  readonly MAX_BASKET_CAPACITY: number = 4; // kilos
  remainingCapacity: number = 4;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private userDataService: UserDataService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private animationCtrl: AnimationController
  ) {
    this.cartItems$ = this.cartService.getCartItems();

    // Initialize address form
    this.addressForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10,11}$')],
      ],
    });
  }

  ngOnInit() {
    this.cartSubscription = this.cartItems$.subscribe((items) => {
      this.currentCartItems = items;
      this.calculateTotals(items);
      this.calculateRemainingCapacity(items);
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
    this.userAuthSubscription = this.authService.user$
      .pipe(
        take(1),
        switchMap((user: firebase.User | null) => {
          if (user && user.uid) {
            return this.userDataService.getUserProfile(user.uid).pipe(
              catchError((error) => {
                console.error('Error fetching user profile:', error);
                this.showToast(
                  'Could not load your profile information. Please try again.',
                  'danger'
                );
                return of(null);
              })
            );
          } else {
            console.error('No authenticated user found.');
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: '/marketplace-checkout' },
            });
            return of(null);
          }
        })
      )
      .subscribe((profile) => {
        this.userProfile = profile as UserProfile | null;
        this.isLoadingProfile = false;

        if (profile) {
          // Populate form with existing data
          this.addressForm.patchValue({
            address: profile.address || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phoneNumber: profile.phoneNumber || '',
          });
        }
      });
  }

  calculateTotals(items: CartItem[]) {
    this.orderSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Apply dynamic delivery fee based on subtotal
    this.deliveryFee = this.orderSubtotal > 500 ? 0 : 50;

    // Apply discount logic (can be extended)
    this.discount = this.applyDiscounts(items);

    this.finalTotal = this.orderSubtotal + this.deliveryFee - this.discount;
  }

  applyDiscounts(items: CartItem[]): number {
    // Example discount: 10% off when order is above 1000
    return this.orderSubtotal > 1000 ? this.orderSubtotal * 0.1 : 0;
  }

  calculateRemainingCapacity(items: CartItem[]) {
    const totalKilos = items.reduce((sum, item) => sum + item.quantity, 0);
    this.remainingCapacity = Math.max(0, this.MAX_BASKET_CAPACITY - totalKilos);
  }

  async removeItem(item: CartItem) {
    // Create slide-out animation
    const element = document.getElementById(`cart-item-${item.id}`);
    if (element) {
      const animation = this.animationCtrl
        .create()
        .addElement(element)
        .duration(300)
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateX(0)', 'translateX(-100%)');

      await animation.play();
    }

    this.cartService.removeFromCart(item.id);

    // Show toast with undo option
    const toast = await this.toastController.create({
      message: `${item.name} removed from cart`,
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          text: 'Undo',
          role: 'cancel',
          handler: () => {
            this.cartService.addToCart(item);
          },
        },
      ],
    });
    toast.present();
  }

  async decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      this.cartService.updateCartItem(updatedItem);
      this.updateItemQuantityAnimation(item.id, 'decrease');
    }
  }

  async increaseQuantity(item: CartItem) {
    // Get current cart items
    const currentItems = await firstValueFrom(this.cartItems$);

    // Calculate total kilos in cart
    const totalKilos = currentItems.reduce(
      (sum: number, cartItem: CartItem) => {
        return (
          sum +
          (cartItem.id === item.id ? cartItem.quantity + 1 : cartItem.quantity)
        );
      },
      0
    );

    // Check if adding 1 more kilo exceeds the basket capacity
    if (totalKilos > this.MAX_BASKET_CAPACITY) {
      const toast = await this.toastController.create({
        message: `Cannot add more items. One basket can only hold ${this.MAX_BASKET_CAPACITY} kilos total.`,
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      toast.present();
      return;
    }

    // Update the item quantity
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    this.cartService.updateCartItem(updatedItem);
    this.updateItemQuantityAnimation(item.id, 'increase');

    // Show remaining capacity
    this.updateRemainingCapacityMessage(this.MAX_BASKET_CAPACITY - totalKilos);
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
    const totalKilos = currentItems.reduce(
      (sum: number, cartItem: CartItem) => {
        return (
          sum + (cartItem.id === item.id ? newQuantity : cartItem.quantity)
        );
      },
      0
    );

    if (totalKilos > this.MAX_BASKET_CAPACITY) {
      const toast = await this.toastController.create({
        message: `Cannot add ${newQuantity} kilos. One basket can only hold ${this.MAX_BASKET_CAPACITY} kilos total.`,
        duration: 2000,
        position: 'bottom',
        color: 'warning',
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
      this.updateRemainingCapacityMessage(
        this.MAX_BASKET_CAPACITY - totalKilos
      );
    }
  }

  private updateItemQuantityAnimation(
    itemId: string,
    direction: 'increase' | 'decrease'
  ) {
    const element = document.getElementById(`quantity-${itemId}`);
    if (element) {
      const animation = this.animationCtrl
        .create()
        .addElement(element)
        .duration(300)
        .fromTo(
          'transform',
          'scale(1)',
          direction === 'increase' ? 'scale(1.2)' : 'scale(0.8)'
        )
        .fromTo('opacity', '1', '0.7')
        .afterClearStyles(['transform', 'opacity']);

      animation.play();
    }
  }

  private async updateRemainingCapacityMessage(remainingKilos: number) {
    if (remainingKilos >= 0) {
      const message =
        remainingKilos === 0
          ? 'Basket is full (4 kilos)'
          : `You can add ${remainingKilos} more kilo${
              remainingKilos > 1 ? 's' : ''
            } in this basket`;

      const toast = await this.toastController.create({
        message,
        duration: 2000,
        position: 'bottom',
        color: remainingKilos === 0 ? 'warning' : 'success',
      });
      toast.present();
    }
  }

  toggleAddressEdit() {
    this.editingAddress = !this.editingAddress;

    if (this.editingAddress && this.userProfile) {
      this.addressForm.patchValue({
        address: this.userProfile.address || '',
        firstName: this.userProfile.firstName || '',
        lastName: this.userProfile.lastName || '',
        phoneNumber: this.userProfile.phoneNumber || '',
      });
    }
  }

  async saveAddress() {
    if (this.addressForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.addressForm.controls).forEach((key) => {
        this.addressForm.get(key)?.markAsTouched();
      });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving address...',
    });
    await loading.present();

    try {
      const user = await firstValueFrom(this.authService.user$.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const addressData = this.addressForm.value;
      await this.userDataService.updateUserProfile(user.uid, addressData);

      // Update local user profile
      this.userProfile = {
        ...this.userProfile,
        ...addressData,
      } as UserProfile;

      this.editingAddress = false;
      this.showToast('Address updated successfully', 'success');
    } catch (error) {
      console.error('Error saving address:', error);
      this.showToast('Failed to save address. Please try again.', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async selectPaymentMethod() {
    const alert = await this.alertController.create({
      header: 'Select Payment Method',
      inputs: this.availablePaymentMethods.map((method) => ({
        type: 'radio',
        label: method.name,
        value: method.id,
        checked: this.selectedPaymentMethod === method.id,
      })),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (data) => {
            if (data) {
              this.selectedPaymentMethod = data;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async placeOrder() {
    // Validate if user profile is complete
    if (!this.userProfile?.address || !this.userProfile?.phoneNumber) {
      this.showToast(
        'Please complete your delivery address information',
        'warning'
      );
      this.editingAddress = true;
      return;
    }

    // Validate if cart is empty
    if (this.currentCartItems.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    // Show loading indicator
    const loading = await this.loadingController.create({
      message: 'Processing your order...',
    });
    await loading.present();

    try {
      this.orderState = 'processing';

      // Prepare order data
      const orderData = {
        items: this.currentCartItems,
        subtotal: this.orderSubtotal,
        deliveryFee: this.deliveryFee,
        discount: this.discount,
        total: this.finalTotal,
        address: this.userProfile.address,
        paymentMethod: this.selectedPaymentMethod,
        orderDate: new Date(),
        userId: (await firstValueFrom(this.authService.user$))?.uid,
      };

      // Submit order to service
      const result = await this.orderService.createOrder(orderData);

      // Process response
      this.orderId = result.orderId;
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 1); // Next day delivery

      // Set order summary
      this.orderSummary = {
        ...orderData,
        orderId: result.orderId,
        estimatedDelivery,
      };

      // Update state and clear cart
      this.orderState = 'confirmed';
      this.cartService.clearCart();

      // Show success message temporarily before transitioning to order confirmation screen
      setTimeout(() => {
        loading.dismiss();
        this.showOrderConfirmation();
      }, 1000);
    } catch (error) {
      console.error('Order placement failed:', error);
      this.orderState = 'failed';
      loading.dismiss();
      this.showToast('Failed to place your order. Please try again.', 'danger');
    }
  }

  showOrderConfirmation() {
    // Animate in the confirmation overlay
    const overlay = document.querySelector('.success-overlay') as HTMLElement;
    if (overlay) {
      const animation = this.animationCtrl
        .create()
        .addElement(overlay)
        .duration(500)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'scale(1.2)', 'scale(1)');

      animation.play();
    }

    // After displaying confirmation, redirect to tracking or home
    setTimeout(() => {
      if (this.orderId) {
        this.router.navigate(['/orders', this.orderId]);
      } else {
        this.router.navigate(['/user-dashboard/marketplace']);
      }
    }, 3000);
  }

  async retryOrder() {
    this.orderState = 'shopping';
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }

  getPaymentMethodName(id: string): string {
    return (
      this.availablePaymentMethods.find((m) => m.id === id)?.name ||
      'Choose method'
    );
  }

  getPaymentMethodIcon(id: string): string {
    return (
      this.availablePaymentMethods.find((m) => m.id === id)?.icon ||
      'wallet-outline'
    );
  }
}
