import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CartService, CartItem } from '../services/cart.service';

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
      image: 'assets/tomato.png'
    },
    {
      id: 'onion',
      name: 'Onion',
      localName: 'Sibuyas',
      image: 'assets/onion.png'
    },
    {
      id: 'eggplant',
      name: 'Eggplant',
      localName: 'Talong',
      image: 'assets/eggplant.png'
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
    // We'll implement the cart page navigation later
    console.log('Opening cart...');
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

    const toast = await this.toastController.create({
      message: `Added ${this.basketCount} basket(s) of ${vegetable.name} to cart`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();

    // Reset basket count after adding to cart
    this.basketCount = 0;
  }
}
