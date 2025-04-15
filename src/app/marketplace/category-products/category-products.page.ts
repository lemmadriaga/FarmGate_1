import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// Define an interface for the product structure
interface Product {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.page.html',
  styleUrls: ['./category-products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CategoryProductsPage implements OnInit {
  categoryLabel: string | null = null;

  // Product data arrays
  mostSearchedProducts: Product[] = [];
  recommendedProducts: Product[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const encodedCategoryLabel = this.route.snapshot.paramMap.get('categoryLabel');
    if (encodedCategoryLabel) {
      this.categoryLabel = decodeURIComponent(encodedCategoryLabel);
      console.log('Displaying products for category:', this.categoryLabel);
      // TODO: Fetch actual products based on categoryLabel
      this.loadSampleProducts(); // Load sample data for now
    }
  }

  // Method to load sample product data (replace with actual data fetching logic)
  loadSampleProducts() {
    // Sample data mimicking the image provided
    this.mostSearchedProducts = [
      {
        name: 'DEWIT Trowel',
        price: 120.00,
        image: 'assets/marketplace/marketplaceCategories/trowel.svg'
      },
      {
        name: 'LOTUS Hand Fork',
        price: 135.00,
        image: 'assets/marketplace/marketplaceCategories/handfork.svg'
      }
    ];

    this.recommendedProducts = [
      {
        name: 'Pruning Shears',
        price: 210.00,
        image: 'assets/marketplace/marketplaceCategories/pruningshears.svg'
      },
      {
        name: 'Irrigation Sprinkler',
        price: 200.00,
        image: 'assets/marketplace/marketplaceCategories/sprinkler.svg'
      }
    ];
  }
}
