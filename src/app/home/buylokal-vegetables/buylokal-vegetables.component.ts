import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-buylokal-vegetables',
  templateUrl: './buylokal-vegetables.component.html',
  styleUrls: ['./buylokal-vegetables.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalVegetablesComponent implements OnInit {
  searchTerm: string = '';
  basketCount: number = 0;
  cartItemCount: number = 0;

  vegetables = [
    {
      id: 'tomato',
      name: 'Tomatoes',
      localName: 'Kamatis',
      image: 'assets/tomato.png',
      price: 80 // Price per basket (4 kilos)
    },
    {
      id: 'onion',
      name: 'Onions',
      localName: 'Sibuyas',
      image: 'assets/onion.png',
      price: 120
    },
    {
      id: 'garlic',
      name: 'Garlic',
      localName: 'Bawang',
      image: 'assets/garlic.png',
      price: 160
    },
    {
      id: 'potato',
      name: 'Potato',
      localName: 'Patatas',
      image: 'assets/potato.png',
      price: 100
    }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private cartService: CartService
  ) {
    this.cartService.getCartItemsCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  goBack() {
    this.router.navigate(['buylokal-options']);
  }

  openCart() {
    this.router.navigate(['/home/marketplace-checkout']);
  }

  // Search functionality logic
  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    // TODO: Implement search functionality
  }

  increaseCount() {
    if (this.basketCount < 10) {
      this.basketCount++;
    }
  }

  decreaseCount() {
    if (this.basketCount > 0) {
      this.basketCount--;
    }
  }

  ngOnInit() { }

  async addToCart(vegetable: any) {
    if (this.basketCount === 0) {
      const toast = await this.toastController.create({
        message: 'Please select the number of baskets first',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      toast.present();
      return;
    }

    const cartItem: CartItem = {
      id: vegetable.id,
      name: vegetable.name,
      localName: vegetable.localName,
      price: vegetable.price, // Add price
      quantity: this.basketCount,
      image: vegetable.image
    };

    this.cartService.addToCart(cartItem);

    const kilos = this.basketCount * 4;
    const toast = await this.toastController.create({
      message: `Added ${this.basketCount} basket(s) of ${vegetable.name} to cart (${kilos} kilos). Each basket contains 4 kilos.`,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
