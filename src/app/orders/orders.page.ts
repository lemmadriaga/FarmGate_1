// orders.page.ts
import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../services/order.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders$: Observable<Order[]>;
  loading = true;
  error = false;

  // For UI filtering
  selectedStatus: string = 'all';
  searchTerm: string = '';

  constructor(
    private orderService: OrderService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const loader = await this.loadingCtrl.create({
      message: 'Loading your orders...',
    });
    await loader.present();

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.orders$ = this.orderService.getUserOrders(user.uid).pipe(
          tap(() => (this.loading = false)),
          catchError((err) => {
            console.error('Error fetching orders:', err);
            this.error = true;
            this.loading = false;
            return of([]);
          }),
          finalize(() => loader.dismiss())
        );
      } else {
        this.loading = false;
        loader.dismiss();
        this.presentAlert(
          'Authentication Error',
          'Please log in to view your orders.'
        );
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
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

  trackOrder(order: Order) {
    if (order.trackingInfo?.trackingNumber) {
      // If you have a tracking details page, you can navigate to it
      // this.router.navigate(['/track-order', order.id]);

      // For now, we'll just show the tracking info in an alert
      this.presentAlert(
        'Tracking Information',
        `Carrier: ${order.trackingInfo.carrier || 'N/A'}\nTracking Number: ${
          order.trackingInfo.trackingNumber
        }\nCurrent Location: ${
          order.trackingInfo.currentLocation || 'In transit'
        }\nLast Updated: ${
          order.trackingInfo.lastUpdate
            ? order.trackingInfo.lastUpdate.toLocaleString()
            : 'N/A'
        }`
      );
    } else {
      this.presentAlert(
        'No Tracking Available',
        'This order does not have tracking information yet.'
      );
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  async cancelOrder(order: Order) {
    const alert = await this.alertCtrl.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason for cancellation (optional)',
        },
      ],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: async (data) => {
            const loader = await this.loadingCtrl.create({
              message: 'Cancelling order...',
            });
            await loader.present();

            try {
              await this.orderService.cancelOrder(order.id, data.reason);
              this.presentAlert('Success', 'Order was cancelled successfully.');
            } catch (error) {
              this.presentAlert(
                'Error',
                'Failed to cancel order. Please try again later.'
              );
            } finally {
              loader.dismiss();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // Filter functions for UI
  filterByStatus(orders: Order[]): Order[] {
    if (!orders) return [];
    if (this.selectedStatus === 'all') return orders;
    return orders.filter((order) => order.status === this.selectedStatus);
  }

  searchOrders(orders: Order[]): Order[] {
    if (!orders || !this.searchTerm) return orders || [];
    const term = this.searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        this.formatDate(order.orderDate).toLowerCase().includes(term)
    );
  }

  applyFilters(orders: Order[]): Order[] {
    if (!orders) return [];
    let filteredOrders = this.filterByStatus(orders);
    return this.searchOrders(filteredOrders);
  }
}
