import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryReservationsPage } from './inventory-reservations.page';

describe('InventoryReservationsPage', () => {
  let component: InventoryReservationsPage;
  let fixture: ComponentFixture<InventoryReservationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
