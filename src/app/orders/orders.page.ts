import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { AnimationController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../services/order.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Import AngularFireAuth
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class OrdersPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = true;
  errorMessage: string = '';

  private authSubscription: any = null;

  // For refreshing orders
  refreshing = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthenticationService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private animationCtrl: AnimationController,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadOrders() {
    this.isLoading = true;
    this.errorMessage = '';

    const loading = await this.loadingController.create({
      message: 'Loading your orders...',
      spinner: 'circular',
    });
    await loading.present();

    // Get the current user directly from AngularFireAuth
    const user = await this.auth.currentUser;

    if (user && user.uid) {
      // If user is authenticated, fetch their orders
      this.orderService
        .getUserOrders(user.uid)
        .pipe(
          catchError((error) => {
            console.error('Error fetching orders:', error);
            this.errorMessage = 'Unable to load your orders. Please try again.';
            return of([]); // Return an empty array in case of error
          })
        )
        .subscribe(
          (orders) => {
            this.orders = orders;
            this.isLoading = false;
            loading.dismiss();
          },
          (error) => {
            console.error('Error loading orders:', error);
            this.errorMessage = 'Unable to load your orders. Please try again.';
            this.isLoading = false;
            loading.dismiss();
          }
        );
    } else {
      this.errorMessage = 'You must be logged in to view orders.';
      this.isLoading = false;
      loading.dismiss();
    }
  }

  async doRefresh(event: any) {
    this.refreshing = true;
    this.errorMessage = '';

    this.authSubscription?.unsubscribe();
    const user = await this.auth.currentUser;

    if (user && user.uid) {
      this.orderService
        .getUserOrders(user.uid)
        .pipe(
          catchError((error) => {
            console.error('Error fetching orders:', error);
            this.errorMessage = 'Unable to load your orders. Please try again.';
            return of([]); // Return an empty array in case of error
          })
        )
        .subscribe(
          (orders) => {
            this.orders = orders;
            this.refreshing = false;
            event.target.complete(); // Complete the refresh
          },
          (error) => {
            console.error('Error loading orders:', error);
            this.errorMessage = 'Unable to load your orders. Please try again.';
            this.refreshing = false;
            event.target.complete(); // Complete the refresh
          }
        );
    } else {
      this.errorMessage = 'You must be logged in to view orders.';
      this.refreshing = false;
      event.target.complete(); // Complete the refresh
    }
  }

  viewOrderDetails(order: Order) {
    // Animate the clicked order item before navigation
    const element = document.getElementById(`order-item-${order.id}`);
    if (element) {
      const animation = this.animationCtrl
        .create()
        .addElement(element)
        .duration(300)
        .fromTo(
          'background',
          'var(--ion-color-light)',
          'var(--ion-color-light-shade)'
        )
        .fromTo('transform', 'scale(1)', 'scale(0.97)');

      animation.play().then(() => {
        this.router.navigate(['/orders', order.id]);
      });
    } else {
      this.router.navigate(['/orders', order.id]);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'tertiary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';

    if (typeof date === 'string') {
      date = new Date(date);
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  continueShoppingClick() {
    this.router.navigate(['/home/marketplace']);
  }

  private animateOrderItems() {
    setTimeout(() => {
      document.querySelectorAll('.order-item').forEach((el, index) => {
        const animation = this.animationCtrl
          .create()
          .addElement(el as HTMLElement)
          .duration(300)
          .delay(index * 100)
          .fromTo('opacity', '0', '1')
          .fromTo('transform', 'translateY(20px)', 'translateY(0)');

        animation.play();
      });
    }, 100);
  }
}
