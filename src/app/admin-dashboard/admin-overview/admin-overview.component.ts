import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { UserDataService, UserProfile, FeedbackReport } from '../../services/user-data.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {

  // Product Data
  products: Product[] = [];
  totalProducts: number = 0;

  // Customer Activity Data
  latestUsers: UserProfile[] = [];
  latestReports: FeedbackReport[] = [];
  isLoadingUsers: boolean = true;
  isLoadingReports: boolean = true;

  constructor(
    private productService: ProductService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.loadMarketData();
    this.loadCustomerData();
  }

  loadMarketData() {
    this.productService.getProducts()
      .pipe(take(1))
      .subscribe(data => {
        console.log('AdminOverviewComponent: Received products from service:', data);
        this.products = data;
        this.totalProducts = data.length;
      });
  }

  loadCustomerData() {
    const dataLimit = 5; 
    this.isLoadingUsers = true;
    this.isLoadingReports = true;

    this.userDataService.getLatestUsers(dataLimit)
      .pipe(take(1))
      .subscribe(users => {
        console.log('AdminOverviewComponent: Received latest users:', users);
        this.latestUsers = users;
        this.isLoadingUsers = false;
      }, error => {
        console.error('Error fetching latest users:', error);
        this.isLoadingUsers = false;
      });

    this.userDataService.getLatestFeedbackAndReports(dataLimit)
      .pipe(take(1))
      .subscribe(reports => {
        console.log('AdminOverviewComponent: Received latest reports:', reports);
        this.latestReports = reports;
        this.isLoadingReports = false;
      }, error => {
        console.error('Error fetching latest reports:', error);
        this.isLoadingReports = false;
      });
  }
}
