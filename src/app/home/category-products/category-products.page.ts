import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';

// Define an interface for the product structure
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.page.html',
  styleUrls: ['./category-products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CategoryProductsPage implements OnInit {
  categoryLabel: string | null = null;
  searchTerm: string = '';

  // Original product data arrays (store the full list)
  private allMostSearchedProducts: Product[] = [];
  private allRecommendedProducts: Product[] = [];

  // Product data arrays for display (will be filtered)
  mostSearchedProducts: Product[] = [];
  recommendedProducts: Product[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private cartService: CartService, private toastController: ToastController) { }

  ngOnInit() {
    const encodedCategoryLabel = this.route.snapshot.paramMap.get('categoryLabel');
    if (encodedCategoryLabel) {
      this.categoryLabel = decodeURIComponent(encodedCategoryLabel);
      console.log('Displaying products for category:', this.categoryLabel);
      this.loadSampleProducts(this.categoryLabel);
    }
  }

  // Method to load sample product data based on category
  loadSampleProducts(categoryLabel: string) {
    console.log(`Loading sample products for: ${categoryLabel}`);
    // Clear existing products before loading new ones
    this.allMostSearchedProducts = [];
    this.allRecommendedProducts = [];

    switch (categoryLabel) {
      case 'Tools & Equipment':
        this.allMostSearchedProducts = [
          { id: 'tool-trowel-001', name: 'DEWIT Trowel', price: 120.00, image: 'assets/marketplace/marketplaceCategories/trowel.svg' },
          { id: 'tool-fork-002', name: 'LOTUS Hand Fork', price: 135.00, image: 'assets/marketplace/marketplaceCategories/handfork.svg' }
        ];
        this.allRecommendedProducts = [
          { id: 'tool-shears-003', name: 'Pruning Shears', price: 210.00, image: 'assets/marketplace/marketplaceCategories/pruningshears.svg' },
          { id: 'tool-can-004', name: 'Watering Can', price: 150.00, image: 'assets/marketplace/marketplaceCategories/wateringcan.png' }
        ];
        break;

      case 'Crop Production':
        this.allMostSearchedProducts = [
          { id: 'crop-fertilizer-001', name: 'Organic Fertilizer', price: 550.00, image: 'assets/marketplace/marketplaceCategories/fertilizer.png' },
          { id: 'crop-seeds-002', name: 'Heirloom Seeds Pack', price: 300.00, image: 'assets/marketplace/marketplaceCategories/heirloomseed.png' }
        ];
        this.allRecommendedProducts = [
          { id: 'crop-pest-003', name: 'Pest Control Spray', price: 400.00, image: 'assets/marketplace/marketplaceCategories/pestcontrol.png' },
          { id: 'crop-soilkit-004', name: 'Soil Test Kit', price: 250.00, image: 'assets/marketplace/marketplaceCategories/soiltestkit.png' }
        ];
        break;

      case 'Farm Machinery':
        // Updated Farm Machinery Data
        this.allMostSearchedProducts = [
          { id: 'mach-cultivator-001', name: 'NAKAJIMA CULTIVATOR X2', price: 136500.0, image: 'assets/cultivator-premium.jpg' },
          { id: 'mach-tractor-002', name: 'JOHN DEERE 5E SERIES TRACTOR', price: 425000.0, image: 'assets/tractor-premium.jpg' },
          { id: 'mach-transplanter-003', name: 'KUBOTA RICE TRANSPLANTER', price: 215000.0, image: 'assets/transplanter.jpg' }
        ];
        // For simplicity, let's leave recommended empty or duplicate one
        this.allRecommendedProducts = [
          // Example: Add one as recommended or leave empty
           { id: 'mach-tractor-002', name: 'JOHN DEERE 5E SERIES TRACTOR', price: 425000.0, image: 'assets/tractor-premium.jpg' }
        ];
        break;

      case 'Livestock & Poultry':
        this.allMostSearchedProducts = [
          { id: 'live-feeder-001', name: 'Chicken Feeder', price: 350.00, image: 'assets/marketplace/marketplaceCategories/chickenfeeder.jpg' },
          { id: 'live-supplement-002', name: 'Cattle Feed Supplement', price: 1800.00, image: 'assets/marketplace/marketplaceCategories/cattlefeed.jpg' }
        ];
        this.allRecommendedProducts = [
          { id: 'live-incubator-003', name: 'Incubator', price: 5000.00, image: 'assets/marketplace/marketplaceCategories/incubator.jpg' },
          { id: 'live-fence-004', name: 'Electric Fence Kit', price: 4500.00, image: 'assets/marketplace/marketplaceCategories/electricfence.png' }
        ];
        break;

      default:
        console.warn('Unknown category:', categoryLabel, 'Loading default sample products.');
        this.allMostSearchedProducts = [
          { id: 'gen-tool-001', name: 'Generic Tool 1', price: 99.00, image: 'assets/icon/favicon.png' },
          { id: 'gen-item-002', name: 'Generic Item 2', price: 199.00, image: 'assets/icon/favicon.png' }
        ];
        this.allRecommendedProducts = [
           { id: 'gen-rec-001', name: 'Recommended Generic 1', price: 149.00, image: 'assets/icon/favicon.png' },
           { id: 'gen-rec-002', name: 'Recommended Generic 2', price: 299.00, image: 'assets/icon/favicon.png' }
        ];
        break;
    }
    // Initially display all loaded products
    this.filterProducts();
  }

  // Filter products based on searchTerm
  filterProducts() {
    const searchTermLower = this.searchTerm.toLowerCase();

    if (!searchTermLower) {
      // If search term is empty, show all original products
      this.mostSearchedProducts = [...this.allMostSearchedProducts];
      this.recommendedProducts = [...this.allRecommendedProducts];
    } else {
      // Filter based on product name containing the search term
      this.mostSearchedProducts = this.allMostSearchedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTermLower)
      );
      this.recommendedProducts = this.allRecommendedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTermLower)
      );
    }
  }

  // Handle input event from search bar
  handleInput(event: any) {
    this.searchTerm = event.target.value ?? '';
    this.filterProducts();
  }

  // Renamed method to handle add to cart
  addToCart(product: Product) {
    console.log('Adding to cart:', product.name);
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      localName: product.name, // Assuming localName is same as name for now
      price: product.price, // Add price
      quantity: 1, // Default quantity to 1
      image: product.image
    };
    this.cartService.addToCart(cartItem);
    this.presentToast(product.name); // Show toast notification
  }

  // Method to show a toast notification
  async presentToast(productName: string) {
    const toast = await this.toastController.create({
      message: `${productName} added to cart!`, // Use productName in the message
      duration: 1500, // Duration in milliseconds
      position: 'bottom', // Position the toast at the bottom
      cssClass: 'cart-toast' // Optional custom CSS class
    });
    toast.present();
  }

  // Method to navigate to the under-construction page
  navigateToUnderConstruction() {
    console.log('Navigating to under construction...');
    this.router.navigateByUrl('/under-construction');
  }
}
