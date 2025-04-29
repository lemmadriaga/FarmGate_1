import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { OrderService, Order } from '../services/order.service';
import { AnimationController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class OrderDetailPage implements OnInit, OnDestroy {
  order: Order | null = null;
  isLoading = true;
  errorMessage: string = '';
  private orderSubscription: Subscription | null = null;

  // For tracking status
  statusSteps = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: 'receipt-outline',
      description: 'Your order has been received',
    },
    {
      key: 'processing',
      label: 'Processing',
      icon: 'construct-outline',
      description: "We're preparing your items",
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: 'bicycle-outline',
      description: 'Your order is on the way',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: 'checkmark-circle-outline',
      description: 'Order delivered successfully',
    },
  ];

  currentStatusIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    } else {
      this.errorMessage = 'Invalid order ID';
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  async loadOrderDetails(orderId: string) {
    this.isLoading = true;
    this.errorMessage = '';

    const loading = await this.loadingController.create({
      message: 'Loading order details...',
      spinner: 'circular',
    });
    await loading.present();

    this.orderSubscription = this.orderService.getOrder(orderId).subscribe(
      (order) => {
        loading.dismiss();
        this.isLoading = false;

        if (order) {
          this.order = order;
          this.updateCurrentStatusIndex();
          this.animateComponents();
        } else {
          this.errorMessage = 'Order not found';
        }
      },
      (error) => {
        loading.dismiss();
        this.isLoading = false;
        console.error('Error fetching order details:', error);
        this.errorMessage = 'Failed to load order details';
      }
    );
  }

  updateCurrentStatusIndex() {
    if (!this.order) return;

    const statusMap: Record<string, number> = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1, // Special case
    };

    this.currentStatusIndex = statusMap[this.order.status] ?? 0;
  }

  isStatusCompleted(index: number): boolean {
    return index < this.currentStatusIndex;
  }

  isStatusCurrent(index: number): boolean {
    return index === this.currentStatusIndex;
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

  calculateSubtotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  async cancelOrder() {
    if (
      !this.order ||
      this.order.status === 'cancelled' ||
      this.order.status === 'delivered' ||
      this.order.status === 'shipped'
    ) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: 'Reason for cancellation (optional)',
        },
      ],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes, Cancel Order',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Cancelling order...',
            });
            await loading.present();

            try {
              await this.orderService.cancelOrder(this.order!.id!, data.reason);
              loading.dismiss();

              const toast = await this.toastController.create({
                message: 'Order has been cancelled successfully',
                duration: 3000,
                color: 'success',
              });
              toast.present();

              // Refresh order details
              this.loadOrderDetails(this.order!.id!);
            } catch (error) {
              loading.dismiss();
              console.error('Error cancelling order:', error);

              const toast = await this.toastController.create({
                message: 'Failed to cancel order. Please try again.',
                duration: 3000,
                color: 'danger',
              });
              toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  backToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShoppingClick() {
    this.router.navigate(['/home/marketplace']);
  }

  private animateComponents() {
    setTimeout(() => {
      // Animate order summary card
      const summaryCard = document.querySelector('.order-summary-card');
      if (summaryCard) {
        this.animationCtrl
          .create()
          .addElement(summaryCard as HTMLElement)
          .duration(400)
          .fromTo('opacity', '0', '1')
          .fromTo('transform', 'translateY(30px)', 'translateY(0)')
          .play();
      }

      // Animate status tracker with staggered effect
      const statusSteps = document.querySelectorAll('.status-step');
      statusSteps.forEach((el, i) => {
        this.animationCtrl
          .create()
          .addElement(el as HTMLElement)
          .duration(300)
          .delay(100 + i * 150)
          .fromTo('opacity', '0', '1')
          .fromTo('transform', 'translateY(20px)', 'translateY(0)')
          .play();
      });

      // Animate order items
      const items = document.querySelectorAll('.order-item');
      items.forEach((el, i) => {
        this.animationCtrl
          .create()
          .addElement(el as HTMLElement)
          .duration(300)
          .delay(400 + i * 100)
          .fromTo('opacity', '0', '1')
          .fromTo('transform', 'translateX(20px)', 'translateX(0)')
          .play();
      });
    }, 100);
  }
}
