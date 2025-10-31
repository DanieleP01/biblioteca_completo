import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansHistoryPage } from './loans-history.page';

describe('LoansHistoryPage', () => {
  let component: LoansHistoryPage;
  let fixture: ComponentFixture<LoansHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
