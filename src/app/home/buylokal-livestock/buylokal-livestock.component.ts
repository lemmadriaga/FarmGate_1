import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-buylokal-livestock',
  templateUrl: './buylokal-livestock.component.html',
  styleUrls: ['./buylokal-livestock.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, FilterPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuylokalLivestockComponent implements OnInit {
  searchTerm: string = '';
  basketCount: number = 0;
  cartItemCount: number = 0;

  livestock = [
    {
      id: 'pork',
      name: 'Pork Belly',
      localName: 'Liempo',
      image: 'assets/porkbelly.png',
      price: 320 // Price per basket (4 kilos)
    },
    {
      id: 'beef',
      name: 'Beef Cubes',
      localName: 'Hiwang Baka',
      image: 'assets/beefcubes.png',
      price: 380
    },
    {
      id: 'chicken',
      name: 'Chicken Legs',
      localName: 'Hita ng Manok',
      image: 'assets/chickenlegs.png',
      price: 280
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

  ngOnInit() { }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
  }

  goBack() {
    this.router.navigate(['buylokal-options']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  openCart() {
    this.router.navigate(['/home/marketplace-checkout']);
  }

  increaseCount() {
    if (this.basketCount < 99) {
      this.basketCount++;
    }
  }

  decreaseCount() {
    if (this.basketCount > 0) {
      this.basketCount--;
    }
  }

  async addToCart(item: any) {
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
      id: item.id,
      name: item.name,
      localName: item.localName,
      price: item.price, // Add price
      quantity: this.basketCount,
      image: item.image
    };

    this.cartService.addToCart(cartItem);

    const kilos = this.basketCount * 4;
    const toast = await this.toastController.create({
      message: `Added ${this.basketCount} basket(s) of ${item.name} to cart (${kilos} kilos). Each basket contains 4 kilos.`,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
