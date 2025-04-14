import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmerDashboardPage } from './farmer-dashboard.page';

describe('FarmerDashboardPage', () => {
  let component: FarmerDashboardPage;
  let fixture: ComponentFixture<FarmerDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
