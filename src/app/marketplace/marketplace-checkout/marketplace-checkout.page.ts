import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketplace-checkout',
  templateUrl: './marketplace-checkout.page.html',
  styleUrls: ['./marketplace-checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MarketplaceCheckoutPage {

  // Mock cart items data
  cartItems = [
    {
      name: 'Dewit Trowel',
      amount: 1,
      price: 120,
      imageUrl: 'assets/marketplace/marketplaceCategories/trowel.svg' // Updated path
    },
    {
      name: 'Irrigation Sprinkler',
      amount: 4,
      price: 800, // Assuming this is the total for 4 items? Or price per item? Let's assume total.
      imageUrl: 'assets/marketplace/marketplaceCategories/sprinkler.svg' // Updated path
    },
    {
      name: 'Lotus Hand Fork',
      amount: 1,
      price: 135,
      imageUrl: 'assets/marketplace/marketplaceCategories/handfork.svg' // Updated path
    }
  ];

  orderSubtotal: number = 0;
  deliveryFee: number = 50; // Example fee
  discount: number = 0; // Example discount
  finalTotal: number = 0;

  constructor() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.orderSubtotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    this.finalTotal = this.orderSubtotal + this.deliveryFee - this.discount;
  }

}
