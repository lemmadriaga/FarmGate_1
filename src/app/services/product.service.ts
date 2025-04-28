import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 

export interface Product {
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

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private mockProducts: Product[] = [
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

  constructor() { }

  getProducts(): Observable<Product[]> {
    console.log('ProductService: Providing mock products.');
    return of(this.mockProducts); 
  }
  
  // Later, you might add methods to fetch from a real API:
  // getProductsFromApi(): Observable<Product[]> { ... }
}
