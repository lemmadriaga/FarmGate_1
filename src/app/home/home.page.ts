import { Component, ViewChild, OnInit } from '@angular/core';
import {
  AnimationController,
  IonContent,
  IonRefresher,
  NavController,
  ToastController,
} from '@ionic/angular';

import { WeatherService } from '../services/weather.service';
import { ProductService, Product } from '../services/product.service';
import { CartService, CartItem } from '../services/cart.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  weatherData: any = {
    temperature: 0,
    condition: '',
    location: '',
    forecast: [],
  };
  searchTerm: string = '';
  searchResults: Product[] = [];
  isSearching: boolean = false;
  allProducts: Product[] = [];
  featuredProducts: Product[] = []; // Re-add featuredProducts property
  isLoadingProducts: boolean = false;

  constructor(
    private animationCtrl: AnimationController,
    private navCtrl: NavController,
    private weatherService: WeatherService,
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadWeather();
    this.loadAllProducts();
  }

  loadWeather() {
    this.weatherService.getCurrentLocation().subscribe((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      this.weatherService.getCurrentWeather(lat, lon).subscribe((data: any) => {
        this.weatherData.temperature = Math.round(data.main.temp);
        this.weatherData.condition = data.weather[0].main;
        this.weatherData.location = data.name;
      });

      this.weatherService.getForecast(lat, lon).subscribe((data: any) => {
        const dailyData = data.list
          .filter((_: unknown, i: number) => i % 8 === 0)
          .slice(0, 4);

        this.weatherData.forecast = dailyData.map(
          (item: any, index: number) => {
            const date = new Date(item.dt * 1000);
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const day = index === 0 ? 'Today' : dayNames[date.getDay()];
            const temp = Math.round(item.main.temp);
            const condition = item.weather[0].main.toLowerCase();

            let icon = 'cloudy';
            if (condition.includes('sun')) icon = 'sunny';
            else if (condition.includes('rain')) icon = 'rainy';
            else if (condition.includes('cloud')) icon = 'cloudy';
            else if (condition.includes('clear')) icon = 'sunny';
            else if (condition.includes('storm')) icon = 'thunderstorm';

            return { day, temp, icon };
          }
        );
      });
    });
  }

  mapWeatherToIcon(condition: string): string {
    if (condition.includes('cloud')) return 'cloudy';
    if (condition.includes('rain')) return 'rainy';
    if (condition.includes('sun') || condition.includes('clear'))
      return 'sunny';
    if (condition.includes('storm')) return 'thunderstorm';
    return 'partly-sunny';
  }

  educationalContent = [
    {
      id: 1,
      title: 'Modern Rice Farming',
      image: 'assets/education/rice-farming.jpg',
      duration: '11 min',
      level: 'Beginner',
      youtubeUrl: 'https://www.youtube.com/watch?v=SJgDswVRuXA',
    },
    {
      id: 2,
      title: 'Sustainable Practices',
      image: 'assets/education/sustainable2.png',
      duration: '20 min',
      level: 'Intermediate',
      youtubeUrl: 'https://www.youtube.com/watch?v=iIqi3Fy2kXM',
    },
    {
      id: 3,
      title: 'Pest Management',
      image: 'assets/education/pest2.png',
      duration: '4 min',
      level: 'Advanced',
      youtubeUrl: 'https://www.youtube.com/watch?v=AVSs-EkYTCo',
    },
  ];

  selectedCategory = 'all';

  segmentChanged(event: CustomEvent): void {
    this.selectedCategory = event.detail.value;
  }

  scrollToTop(): void {
    this.content.scrollToTop(500);
  }

  doRefresh(event: any): void {
    this.loadWeather();
    this.loadAllProducts();
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  handleSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;
    this.isSearching = query.length > 0;
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.isSearching) {
      this.searchResults = [];
      return;
    }
    if (this.isLoadingProducts) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.allProducts.filter((product) => {
      return product.name.toLowerCase().includes(this.searchTerm) ||
             (product.localName && product.localName.toLowerCase().includes(this.searchTerm));
    });
  }

  loadAllProducts(): void {
    this.isLoadingProducts = true;

    this.productService.getProducts()
      .pipe(
        finalize(() => {
          // We need both calls to complete before setting loading to false
        })
      )
      .subscribe((allFetchedProducts: Product[]) => {
        this.allProducts = allFetchedProducts;
        console.log('All products loaded:', this.allProducts.length);

        // Also fetch featured products specifically
        this.productService.getFeaturedProducts()
          .pipe(
            finalize(() => {
              this.isLoadingProducts = false; // Now set loading false
              this.filterProducts(); // Filter after all data is loaded
            })
          )
          .subscribe((featuredFetchedProducts: Product[]) => {
            this.featuredProducts = featuredFetchedProducts;
            console.log('Featured products loaded:', this.featuredProducts.length);
          }, error => {
             console.error("Error loading featured products:", error);
             this.isLoadingProducts = false; // Ensure loading is false on error
          });
      }, error => {
        console.error("Error loading products:", error);
        this.isLoadingProducts = false; // Ensure loading is false on error
      });
  }

  addToCart(product: Product) {
    console.log('Adding to cart from home:', product.name);
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      localName: product.name, // Use product name as localName for now
      price: product.price,
      quantity: 1, // Add one item
      image: product.image,
    };
    this.cartService.addToCart(cartItem);
    this.presentToast(`${product.name} added to cart!`);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      cssClass: 'cart-toast' // Optional custom CSS class for styling
    });
    toast.present();
  }

  buyLokal() {
    this.navCtrl.navigateForward('user-dashboard/BuyLokal');
  }
  marketplace() {
    this.navCtrl.navigateForward('user-dashboard/marketplace');
  }

  openYoutubeVideo(url: string): void {
    window.open(url, '_blank');
  }

  goToEducationalHub() {
    this.navCtrl.navigateForward('user-dashboard/educational-hub');
  }

  underConstruction() {
    this.navCtrl.navigateForward('under-construction');
  }
  profile() {
    this.navCtrl.navigateForward('user-dashboard/profile');
  }
}
