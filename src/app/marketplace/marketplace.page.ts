import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MarketplacePage {
  constructor(private router: Router) {}

  categories = [
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/shovel.svg', label: 'Hand Tools' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/fertilizer.svg', label: 'Fertilizers' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/seedling.svg', label: 'Seeds & Plants' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/waterdroplet.svg', label: 'Irrigation' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/bug.svg', label: 'Pest Control' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/machinery.svg', label: 'Machinery' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/harvesting.svg', label: 'Harvesting' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/hardhat.svg', label: 'Safety' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/livestock.svg', label: 'Livestock Handling' },
    { icon: 'assets/marketplace/marketplaceHomepage/homepageIcons/more.svg', label: 'More' }
  ];

  categoryColors = [
    '#c8a464', 
    '#aed581', 
    '#66bb6a', 
    '#42a5f5', 
    '#ef5350', 
    '#66bb6a', 
    '#66bb6a', 
    '#ffee58', 
    '#42a5f5', 
    '#66bb6a'  
  ];
  
  stores = [
    { logo: 'assets/marketplace/marketplaceHomepage/homepageIcons/claas.svg', name: 'CLAAS' },
    { logo: 'assets/marketplace/marketplaceHomepage/homepageIcons/agco.svg', name: 'AGCO' },
    { logo: 'assets/marketplace/marketplaceHomepage/homepageIcons/cnh.svg', name: 'CNH' },
    { logo: 'assets/marketplace/marketplaceHomepage/homepageIcons/johndeere.svg', name: 'John Deere' }
  ];
  newestMachine = {
    name: 'NAKAJIMA CULTIVATOR',
    image: 'assets/marketplace/marketplaceHomepage/nakajima_cultivator.svg',
    brandLogo: 'assets/marketplace/marketplaceHomepage/nakajima_logo.svg',
    sale: true,
    price: 136500,
    oldPrice: 195000
  };

  goToCategory(categoryLabel: string) {
    const encodedCategory = encodeURIComponent(categoryLabel);
    this.router.navigate(['/marketplace/category-products', encodedCategory]);
  }
}
