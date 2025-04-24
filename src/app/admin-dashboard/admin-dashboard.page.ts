// admin-dashboard.page.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AdminDashboardPage implements OnInit, AfterViewInit {
  recentActivities = [
    {
      title: 'New Order Placed',
      description: 'Order #45623 from John Smith',
      time: '2 hrs ago',
      icon: 'cart',
      iconBg: '#e8f5e9',
      iconColor: '#4CAF50',
    },
    {
      title: 'New Farmer Registration',
      description: 'Emma Davis joined the platform',
      time: '5 hrs ago',
      icon: 'person-add',
      iconBg: '#e3f2fd',
      iconColor: '#2196F3',
    },
    {
      title: 'New Product Listed',
      description: 'Organic Tomatoes added by Green Farm',
      time: '8 hrs ago',
      icon: 'leaf',
      iconBg: '#fff8e1',
      iconColor: '#FFC107',
    },
    {
      title: 'Payment Received',
      description: '$345.80 payment from Order #45612',
      time: '1 day ago',
      icon: 'cash',
      iconBg: '#e8f5e9',
      iconColor: '#4CAF50',
    },
  ];

  topProducts = [
    {
      name: 'Organic Tomatoes',
      category: 'Vegetables',
      sales: 125,
      price: '4.99',
      image: 'assets/products/tomatoes.jpg',
    },
    {
      name: 'Fresh Strawberries',
      category: 'Fruits',
      sales: 98,
      price: '5.49',
      image: 'assets/products/strawberries.jpg',
    },
    {
      name: 'Garden Shovel',
      category: 'Hard Tools',
      sales: 87,
      price: '12.99',
      image: 'assets/products/shovel.jpg',
    },
    {
      name: 'Organic Fertilizer',
      category: 'Fertilizers',
      sales: 76,
      price: '18.50',
      image: 'assets/products/fertilizer.jpg',
    },
  ];

  activeFarmers = [
    {
      name: 'Michael Johnson',
      location: 'Green Valley Farm, California',
      avatar: 'assets/farmers/farmer1.jpg',
    },
    {
      name: 'Sarah Williams',
      location: 'Sunrise Organics, Oregon',
      avatar: 'assets/farmers/farmer2.jpg',
    },
    {
      name: 'Robert Garcia',
      location: 'Riverside Ranch, Texas',
      avatar: 'assets/farmers/farmer3.jpg',
    },
  ];

  private salesChart: Chart | null = null;

  constructor() {}

  ngOnInit() {
    // Initialize any data needed on component load
  }

  ngAfterViewInit() {
    this.initSalesChart();
  }

  initSalesChart() {
    const ctx = document.getElementById('sales-chart') as HTMLCanvasElement;

    if (ctx) {
      this.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          datasets: [
            {
              label: 'Total Sales',
              data: [
                12500, 15000, 17800, 16500, 21000, 22400, 24000, 25600, 23800,
                26500, 28000, 29500,
              ],
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderColor: '#4CAF50',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Total Orders',
              data: [
                250, 320, 380, 330, 420, 450, 470, 500, 480, 520, 550, 580,
              ],
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderColor: '#2196F3',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                // Removed borderDash as it's causing an error
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                callback: function (value) {
                  const numValue = Number(value);
                  if (!isNaN(numValue) && numValue >= 1000) {
                    return '$' + numValue / 1000 + 'k';
                  }
                  return '$' + value;
                },
              },
            },
          },
        },
      });
    }
  }
}
