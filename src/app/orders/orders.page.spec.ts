import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersPage } from './orders.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser = { uid: 'user123' };
  const mockOrders = [
    {
      id: 'ORDER123',
      items: [
        { id: 'item1', name: 'Rice', price: 50, quantity: 2 },
        { id: 'item2', name: 'Beans', price: 30, quantity: 1 }
      ],
      subtotal: 130,
      deliveryFee: 50,
      discount: 0,
      total: 180,
      address: '123 Test St, City',
      paymentMethod: 'cash',
      orderDate: new Date(),
      userId: 'user123',
      status: 'pending',
      estimatedDelivery: new Date()
    }
  ];

  beforeEach(async () => {
    const orderServiceSpyObj = jasmine.createSpyObj('OrderService', ['getUserOrders']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [], { user$: of(mockUser) });

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        OrdersPage
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    orderServiceSpy.getUserOrders.and.returnValue(of(mockOrders));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(orderServiceSpy.getUserOrders).toHaveBeenCalledWith(mockUser.uid);
    expect(component.orders).toEqual(mockOrders);
  });

  it('should display orders when loaded', () => {
    fixture.detectChanges();
    const orderElements = fixture.debugElement.queryAll(By.css('.order-item'));
    expect(orderElements.length).toBe(mockOrders.length);
  });

  it('should display order ID in the list', () => {
    fixture.detectChanges();
    const orderIdText = fixture.debugElement.query(By.css('ion-card-subtitle ion-text')).nativeElement.textContent;
    expect(orderIdText).toContain('ORDER123');
  });

  it('should display the correct status badge', () => {
    fixture.detectChanges();
    const statusBadge = fixture.debugElement.query(By.css('ion-badge')).nativeElement;
    expect(statusBadge.textContent.trim().toLowerCase()).toBe('pending');
  });

  it('should call viewOrderDetails when order is clicked', () => {
    spyOn(component, 'viewOrderDetails');
    fixture.detectChanges();
    
    const orderCard = fixture.debugElement.query(By.css('.order-item'));
    orderCard.triggerEventHandler('click', null);
    
    expect(component.viewOrderDetails).toHaveBeenCalledWith(mockOrders[0]);
  });

  it('should display empty state when no orders', () => {
    component.orders = [];
    fixture.detectChanges();
    
    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
    
    const continueShoppingBtn = emptyState.query(By.css('ion-button'));
    expect(continueShoppingBtn).toBeTruthy();
  });

  it('should refresh orders on doRefresh', () => {
    // Reset spy call count
    orderServiceSpy.getUserOrders.calls.reset();
    
    // Mock the event object
    const refreshEvent = { target: { complete: jasmine.createSpy('complete') } };
    
    // Call doRefresh
    component.doRefresh(refreshEvent);
    
    // Should call getUserOrders again
    expect(orderServiceSpy.getUserOrders).toHaveBeenCalledWith(mockUser.uid);
    
    // Simulate subscription callback
    component.orders = [...mockOrders, { ...mockOrders[0], id: 'NEW_ORDER' }];
    fixture.detectChanges();
    
    // Should complete the refresh event
    expect(refreshEvent.target.complete).toHaveBeenCalled();
  });
});