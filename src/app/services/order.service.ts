import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { CartItem } from '../services/cart.service';

export interface Order {
  id?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  address: string;
  paymentMethod: string;
  orderDate: Date;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  trackingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    lastUpdate?: Date;
    currentLocation?: string;
  };
}

export interface OrderCreateResponse {
  orderId: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection<Order>('orders');
  }

  createOrder(orderData: any): Promise<OrderCreateResponse> {
    // Generate a unique order ID with a timestamp prefix for easier sorting
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `FG-${timestamp}-${randomId}`;

    // Prepare complete order object
    const order: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      orderDate: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery(),
    };

    // Save to Firestore
    return this.ordersCollection
      .doc(orderId)
      .set(order)
      .then(() => {
        return {
          orderId: orderId,
          success: true,
        };
      })
      .catch((error) => {
        console.error('Error creating order:', error);
        throw error;
      });
  }

  getOrder(orderId: string): Observable<Order | undefined> {
    return this.ordersCollection
      .doc<Order>(orderId)
      .valueChanges()
      .pipe(
        take(1),
        catchError((error) => {
          console.error('Error fetching order:', error);
          return throwError(() => new Error('Order not found'));
        })
      );
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.firestore
      .collection<Order>('orders', (ref) =>
        ref.where('userId', '==', userId).orderBy('orderDate', 'desc')
      )
      .valueChanges()
      .pipe(
        catchError((error) => {
          console.error('Error fetching user orders:', error);
          return throwError(() => new Error('Failed to load orders'));
        })
      );
  }

  updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    return this.ordersCollection.doc(orderId).update({ status });
  }

  cancelOrder(orderId: string, reason?: string): Promise<void> {
    return this.ordersCollection.doc(orderId).update({
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
    });
  }

  updateTrackingInfo(
    orderId: string,
    trackingInfo: Order['trackingInfo']
  ): Promise<void> {
    return this.ordersCollection.doc(orderId).update({
      trackingInfo,
      status: 'shipped',
    });
  }

  private calculateEstimatedDelivery(): Date {
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 1);

    const dayOfWeek = estimatedDate.getDay();
    if (dayOfWeek === 0) {
      estimatedDate.setDate(estimatedDate.getDate() + 1);
    }

    return estimatedDate;
  }
}
