import { Component, ViewChild } from '@angular/core';
import {
  AnimationController,
  IonContent,
  IonRefresher,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(
    private animationCtrl: AnimationController,
    private navCtrl: NavController
  ) {}

  featuredProducts = [
    {
      id: 1,
      name: 'Premium Rice Seeds',
      price: 'Php 1,200',
      discount: '10% off',
      image: 'assets/products/rice-seeds.jpg',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Organic Fertilizer',
      price: 'Php 850',
      discount: '15% off',
      image: 'assets/products/fertilizer.jpg',
      rating: 4.5,
    },
    {
      id: 3,
      name: 'Irrigation Kit',
      price: 'Php 3,500',
      discount: '5% off',
      image: 'assets/products/irrigation.jpg',
      rating: 4.7,
    },
  ];

  educationalContent = [
    {
      id: 1,
      title: 'Modern Rice Farming',
      image: 'assets/education/rice-farming.jpg',
      duration: '25 min',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Sustainable Practices',
      image: 'assets/education/sustainable.jpg',
      duration: '40 min',
      level: 'Intermediate',
    },
    {
      id: 3,
      title: 'Pest Management',
      image: 'assets/education/pest-management.jpg',
      duration: '35 min',
      level: 'Advanced',
    },
  ];

  weatherData = {
    temperature: 32,
    condition: 'Sunny',
    location: 'San Fernando',
    forecast: [
      { day: 'Today', temp: 32, icon: 'sunny' },
      { day: 'Thu', temp: 31, icon: 'partly-sunny' },
      { day: 'Fri', temp: 29, icon: 'rainy' },
      { day: 'Sat', temp: 30, icon: 'partly-sunny' },
    ],
  };

  selectedCategory = 'all';

  segmentChanged(event: CustomEvent): void {
    this.selectedCategory = event.detail.value;
  }

  scrollToTop(): void {
    this.content.scrollToTop(500);
  }

  doRefresh(event: any): void {
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  buyLokal() {
    this.navCtrl.navigateForward('buylokal-options')
  }
}
