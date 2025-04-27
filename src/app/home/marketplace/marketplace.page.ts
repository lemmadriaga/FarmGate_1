import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs'; 
import { IonModal } from '@ionic/angular';

interface Category {
  id: string;
  name: string;
}

type SelectedCategories = Record<string, boolean>;

interface Product {
  id: string;
  name: string;
  localName?: string;
  price: number;
  quantity?: string;
  image: string;
  farmerName?: string;
  farmerLocation?: string;
  rating?: number;
  categoryId?: string; 
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage implements OnInit {
  isDarkMode = false;
  weatherData = {
    temp: 28,
    condition: 'Sunny',
    location: 'Bacolod City',
    icon: 'sunny-outline',
  };

  recommendedProducts = [
    {
      id: 'prod-cultivator-001',
      name: 'NAKAJIMA CULTIVATOR X2',
      price: 136500.0,
      originalPrice: 195000.0,
      discount: 30,
      rating: 4.8,
      reviewCount: 124,
      image: 'assets/cultivator-premium.jpg',
      brand: 'NAKAJIMA',
      featured: true,
      tags: ['Bestseller', 'Fuel Efficient'],
    },
    {
      id: 'prod-tractor-002',
      name: 'JOHN DEERE 5E SERIES TRACTOR',
      price: 425000.0,
      originalPrice: 500000.0,
      discount: 15,
      rating: 4.9,
      reviewCount: 86,
      image: 'assets/tractor-premium.jpg',
      brand: 'JOHN DEERE',
      featured: false,
      tags: ['New', 'Smart Technology'],
    },
    {
      id: 'prod-transplanter-003',
      name: 'KUBOTA RICE TRANSPLANTER',
      price: 215000.0,
      originalPrice: 250000.0,
      discount: 14,
      rating: 4.7,
      reviewCount: 52,
      image: 'assets/transplanter.jpg',
      brand: 'KUBOTA',
      featured: false,
      tags: ['Limited Stock'],
    },
  ];

  farmCategories = [
    {
      id: 1,
      name: 'Tools & Equipment',
      icon: 'build',
      color: '#3A5A40',
      subCategories: ['Hand Tools', 'Power Tools', 'Storage'],
    },
    {
      id: 2,
      name: 'Crop Production',
      icon: 'leaf',
      color: '#588157',
      subCategories: ['Seeds', 'Fertilizers', 'Irrigation'],
    },
    {
      id: 3,
      name: 'Farm Machinery',
      icon: 'car',
      color: '#A3B18A',
      subCategories: ['Tractors', 'Harvesters', 'Planters'],
    },
    {
      id: 4,
      name: 'Livestock & Poultry',
      icon: 'paw',
      color: '#344E41',
      subCategories: ['Feed', 'Healthcare', 'Equipment'],
    },
  ];

  featuredBrands = [
    { name: 'JOHN DEERE', logo: 'assets/john-deere-logo.png', featured: true },
    { name: 'CLAAS', logo: 'assets/claas-logo.png', featured: false },
    { name: 'KUBOTA', logo: 'assets/kubota-logo.png', featured: true },
    { name: 'AGCO', logo: 'assets/agco-logo.png', featured: false },
    { name: 'CNH', logo: 'assets/cnh-logo.png', featured: false },
    { name: 'NAKAJIMA', logo: 'assets/nakajima-logo.png', featured: true },
  ];

  upcomingEvents = [
    {
      title: 'Farm Tech Expo 2025',
      date: 'May 15-18, 2025',
      location: 'Manila Convention Center',
      image: 'assets/event-expo.jpg',
    },
    {
      title: 'Sustainable Farming Workshop',
      date: 'June 3, 2025',
      location: 'Virtual Event',
      image: 'assets/event-workshop.jpg',
    },
  ];

  financeOptions = [
    {
      title: 'Equipment Financing',
      description: 'Low 3% interest rate for machinery purchases',
      icon: 'calculator-outline',
    },
    {
      title: 'Seasonal Loans',
      description: 'Short-term capital for planting season',
      icon: 'calendar-outline',
    },
    {
      title: 'Land Expansion',
      description: 'Long-term financing for property acquisition',
      icon: 'map-outline',
    },
  ];

  slideOpts = {
    slidesPerView: 1.2,
    spaceBetween: 20,
    centeredSlides: false,
    initialSlide: 0,
  };

  farmingTips = [
    {
      tip: 'Rotate crops to maintain soil health and reduce pest problems',
      author: 'Dr. Maria Santos',
      authorTitle: 'Agricultural Scientist',
    },
    {
      tip: 'Check your machinery before the season starts to avoid breakdowns',
      author: 'Eng. Roberto Cruz',
      authorTitle: 'Agricultural Engineer',
    },
  ];

  public cartItemCount$: Observable<number>; 

  @ViewChild('filterModal') filterModal!: IonModal;

  availableCategories: Category[] = []; 
  sortBy: string = 'recommended'; 
  selectedCategories: SelectedCategories = {};
  tempSortBy: string = 'recommended';
  tempSelectedCategories: SelectedCategories = {};

  products: Product[] = []; 
  filteredProducts: Product[] = [];

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private cartService: CartService,
    private toastController: ToastController
  ) { 
    this.cartItemCount$ = this.cartService.getCartItemsCount(); 
  }

  ngOnInit() {
    // Fetch initial products FIRST
    this.fetchProducts(); 
    // THEN derive categories from products
    this.fetchCategories(); 
    // Apply default filters/sort initially
    this.applyCurrentFiltersAndSort(); 
  }

  fetchProducts() {
    // Replace with actual service call to fetch products
    this.products = [
      {
        id: 'prod-001',
        name: 'Product 1',
        price: 100,
        image: 'assets/product1.jpg',
        categoryId: 'vegetables',
      },
      {
        id: 'prod-002',
        name: 'Product 2',
        price: 200,
        image: 'assets/product2.jpg',
        categoryId: 'fruits',
      },
      {
        id: 'prod-003',
        name: 'Product 3',
        price: 300,
        image: 'assets/product3.jpg',
        categoryId: 'equipment',
      },
    ];
  }

  fetchCategories() {
    // Derive categories from the fetched products
    if (!this.products || this.products.length === 0) {
      console.warn('No products available to derive categories from.');
      this.availableCategories = [];
      this.selectedCategories = {};
      this.tempSelectedCategories = {};
      return;
    }

    const categoryMap = new Map<string, string>();
    this.products.forEach(product => {
      if (product.categoryId && !categoryMap.has(product.categoryId)) {
        // Use categoryId as name for simplicity, capitalize first letter
        const categoryName = product.categoryId.charAt(0).toUpperCase() + product.categoryId.slice(1);
        categoryMap.set(product.categoryId, categoryName);
      }
    });

    this.availableCategories = Array.from(categoryMap, ([id, name]) => ({ id, name }));
    console.log('Derived categories:', this.availableCategories);

    // Initialize selectedCategories based on available ones
    this.selectedCategories = this.availableCategories.reduce((acc, cat) => {
      acc[cat.id] = false; // Initially, no categories are selected
      return acc;
    }, {} as SelectedCategories);
    this.tempSelectedCategories = { ...this.selectedCategories };
    this.tempSortBy = this.sortBy;
    console.log('Initial selectedCategories:', this.selectedCategories);
  }

  prepareModalState() {
    console.log('Modal will present. Copying filter state.');
    this.tempSortBy = this.sortBy;
    this.tempSelectedCategories = { ...this.selectedCategories };
  }

  presentFilterModal() {
    console.log('Present filter modal button clicked.');
  }

  cancelFilters() {
    console.log('Cancelling filters.');
    this.filterModal.dismiss(null, 'cancel');
  }

  applyFilters() {
    console.log('Applying filters...');
    this.sortBy = this.tempSortBy;
    this.selectedCategories = { ...this.tempSelectedCategories }; 

    console.log('Applied sortBy:', this.sortBy);
    console.log('Applied selectedCategories:', this.selectedCategories);

    this.applyCurrentFiltersAndSort(); 

    this.filterModal.dismiss(null, 'apply');
  }

  applyCurrentFiltersAndSort() {
    console.log('Applying filters and sort to products...');
    console.log('Current sortBy:', this.sortBy);
    console.log('Current selectedCategories:', this.selectedCategories);

    let currentlyFiltered = [...this.products]; 

    const activeCategoryIds = Object.entries(this.selectedCategories)
                                   .filter(([id, isSelected]) => isSelected)
                                   .map(([id]) => id);

    console.log('Active category IDs for filtering:', activeCategoryIds);

    if (activeCategoryIds.length > 0) {
      currentlyFiltered = currentlyFiltered.filter(product =>
        product.categoryId && activeCategoryIds.includes(product.categoryId)
      );
      console.log('Products after category filter:', currentlyFiltered.length);
    } else {
      console.log('No categories selected, showing all products.');
    }

    switch (this.sortBy) {
      case 'price_asc':
        currentlyFiltered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        currentlyFiltered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        currentlyFiltered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        currentlyFiltered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'recommended':
      default:
        console.log('Sorting by recommended/default.');
        break;
    }
    console.log('Products after sorting:', currentlyFiltered.length);

    this.filteredProducts = currentlyFiltered; 
    console.log('Final filteredProducts:', this.filteredProducts);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  searchProducts(event: any) {
    console.log('Searching for:', event.target.value);
  }

  showProductDetails(product: any) {
    console.log('Viewing product:', product.name);
  }

  enterChatSupport() {
    console.log('Opening chat support');
  }

  applyForFinancing(option: any) {
    console.log('Applying for financing:', option.title);
  }

  addToCartAndNavigate(product: any) {
    console.log('Adding to cart:', product.name);
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      localName: product.name, 
      price: product.price, 
      quantity: 1, 
      image: product.image
    };
    this.cartService.addToCart(cartItem);
    this.presentToast(product.name); 
  }

  async presentToast(productName: string) {
    const toast = await this.toastController.create({
      message: `${productName} added to cart!`, 
      duration: 1500, 
      position: 'bottom', 
      cssClass: 'cart-toast' 
    });
    toast.present();
  }
}
