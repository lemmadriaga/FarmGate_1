import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 

export interface Product {
  id: string;
  name: string;
  localName?: string;
  price: number;
  discount?: string;
  quantity?: string;
  image: string;
  farmerName?: string;
  farmerLocation?: string;
  rating?: number;
  categoryId?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private allProducts: Product[] = [];

  constructor() { 
    this.initializeProducts();
  }

  private initializeProducts(): void {
    const productsMap = new Map<string, Product>();

    // Define all product sources here
    // const mockProducts: Product[] = [ 
    //   { id: 'prod-001', name: 'Product 1', price: 100, image: 'assets/product1.jpg', categoryId: 'vegetables' },
    //   { id: 'prod-002', name: 'Product 2', price: 200, image: 'assets/product2.jpg', categoryId: 'fruits' },
    //   { id: 'prod-003', name: 'Product 3', price: 300, image: 'assets/product3.jpg', categoryId: 'equipment' },
    // ];

    const featuredProducts: Product[] = [
      { id: 'feat-001', name: 'Premium Rice Seeds', price: 1200, discount: '10% off', image: 'assets/products/rice-seeds.jpg', rating: 4.8 },
      { id: 'feat-002', name: 'Organic Fertilizer', price: 850, discount: '15% off', image: 'assets/products/fertilizer.jpg', rating: 4.5 },
      { id: 'feat-003', name: 'Irrigation Kit', price: 3500, discount: '5% off', image: 'assets/products/irrigation.jpg', rating: 4.7 },
    ];

    const categoryProducts: Product[] = [
      // Tools & Equipment
      { id: 'tool-trowel-001', name: 'DEWIT Trowel', price: 120.00, discount: '10% off', rating: 4.9, image: 'assets/marketplace/marketplaceCategories/trowel.svg' },
      { id: 'tool-fork-002', name: 'LOTUS Hand Fork', price: 135.00, discount: '12% off', rating: 4.8, image: 'assets/marketplace/marketplaceCategories/handfork.svg' },
      { id: 'tool-shears-003', name: 'Pruning Shears', price: 210.00, discount: '15% off', rating: 4.5, image: 'assets/marketplace/marketplaceCategories/pruningshears.svg' },
      { id: 'tool-can-004', name: 'Watering Can', price: 150.00, discount: '8% off', rating: 4.7, image: 'assets/marketplace/marketplaceCategories/wateringcan.png' },
      // Crop Production
      { id: 'crop-fertilizer-001', name: 'Organic Fertilizer', price: 550.00, discount: '12% off', rating: 4.6, image: 'assets/marketplace/marketplaceCategories/fertilizer.png' },
      { id: 'crop-seeds-002', name: 'Heirloom Seeds Pack', price: 300.00, discount: '10% off', rating: 4.8, image: 'assets/marketplace/marketplaceCategories/heirloomseed.png' },
      { id: 'crop-pest-003', name: 'Pest Control Spray', price: 400.00, discount: '8% off', rating: 4.6, image: 'assets/marketplace/marketplaceCategories/pestcontrol.png' },
      { id: 'crop-soilkit-004', name: 'Soil Test Kit', price: 250.00, discount: '10% off', rating: 4.9, image: 'assets/marketplace/marketplaceCategories/soiltestkit.png' },
      // Farm Machinery
      { id: 'mach-cultivator-001', name: 'NAKAJIMA CULTIVATOR X2', price: 136500.0, discount: '5% off', rating: 4.8, image: 'assets/cultivator-premium.jpg' },
      { id: 'mach-tractor-002', name: 'JOHN DEERE 5E SERIES TRACTOR', price: 425000.0, discount: '3% off', rating: 4.7, image: 'assets/tractor-premium.jpg' },
      { id: 'mach-transplanter-003', name: 'KUBOTA RICE TRANSPLANTER', price: 215000.0, discount: '5% off', rating: 4.6, image: 'assets/transplanter.jpg' },
      // Livestock & Poultry
      { id: 'live-feeder-001', name: 'Chicken Feeder', price: 350.00, discount: '8% off', rating: 4.6, image: 'assets/marketplace/marketplaceCategories/chickenfeeder.jpg' },
      { id: 'live-supplement-002', name: 'Cattle Feed Supplement', price: 1800.00, discount: '12% off', rating: 4.8, image: 'assets/marketplace/marketplaceCategories/cattlefeed.jpg' },
      { id: 'live-incubator-003', name: 'Incubator', price: 5000.00, discount: '10% off', rating: 4.9, image: 'assets/marketplace/marketplaceCategories/incubator.jpg' },
      { id: 'live-fence-004', name: 'Electric Fence Kit', price: 4500.00, discount: '8% off', rating: 4.7, image: 'assets/marketplace/marketplaceCategories/electricfence.png' },
    ];

    // Consolidate using the Map to prevent duplicates
    // mockProducts.forEach(p => productsMap.set(p.id, p));
    featuredProducts.forEach(p => productsMap.set(p.id, p));
    categoryProducts.forEach(p => productsMap.set(p.id, p));

    this.allProducts = Array.from(productsMap.values());
    console.log('ProductService: Initialized all products:', this.allProducts.length);
  }


  getProducts(): Observable<Product[]> {
    console.log('ProductService: Providing ALL consolidated products.');
    return of(this.allProducts);
  }
  
  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.allProducts.filter(p => p.id.startsWith('feat-'));
    console.log('ProductService: Providing featured products:', featured.length);
    return of(featured);
  }
  
  // Later, you might add methods to fetch from a real API:
  // getProductsFromApi(): Observable<Product[]> { ... }
}
