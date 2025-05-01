import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-buylokal-fruits',
  templateUrl: './buylokal-fruits.component.html',
  styleUrls: ['./buylokal-fruits.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, FilterPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalFruitsComponent implements OnInit {
  searchTerm: string = '';
  basketCount: number = 0;
  cartItemCount: number = 0;

  fruits = [
    {
      id: 'mango',
      name: 'Mango',
      localName: 'Mangga',
      image: 'assets/mango.png',
      price: 180
    },
    {
      id: 'banana',
      name: 'Banana',
      localName: 'Saging',
      image: 'assets/banana.png',
      price: 120
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      localName: 'Pinya',
      image: 'assets/pineapple.png',
      price: 160
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

  async addToCart(fruit: any) {
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
      id: fruit.id,
      name: fruit.name,
      localName: fruit.localName,
      price: fruit.price,
      quantity: this.basketCount,
      image: fruit.image
    };

    this.cartService.addToCart(cartItem);

    const kilos = this.basketCount * 4;
    const toast = await this.toastController.create({
      message: `Added ${this.basketCount} basket(s) of ${fruit.name} to cart (${kilos} kilos). Each basket contains 4 kilos.`,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
