import { Component, ViewChild, OnInit } from '@angular/core';
import {
  AnimationController,
  IonContent,
  IonRefresher,
  NavController,
} from '@ionic/angular';

import { WeatherService } from '../services/weather.service';

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
  constructor(
    private animationCtrl: AnimationController,
    private navCtrl: NavController,
    private weatherService: WeatherService
  ) {}
  ngOnInit() {
    this.loadWeather();
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
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  buyLokal() {
    this.navCtrl.navigateForward('user-dashboard/BuyLokal');
  }
  marketplace(){
    this.navCtrl.navigateForward('user-dashboard/marketplace')
  }

  openYoutubeVideo(url: string): void {
    window.open(url, '_blank');
  }

  goToEducationalHub() {
    this.navCtrl.navigateForward('user-dashboard/educational-hub');
  }

  underConstruction(){
    this.navCtrl.navigateForward('under-construction')
  }
  profile(){
    this.navCtrl.navigateForward('user-dashboard/profile')
  }
}
