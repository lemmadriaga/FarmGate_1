import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      name: 'Machinery',
      icon: 'car',
      color: '#A3B18A',
      subCategories: ['Tractors', 'Harvesters', 'Planters'],
    },
    {
      id: 4,
      name: 'Livestock',
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

  constructor(private animationCtrl: AnimationController) {}

  ngOnInit() {}

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
}
