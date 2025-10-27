import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanRequestPage } from './loan-request.page';

describe('LoanRequestPage', () => {
  let component: LoanRequestPage;
  let fixture: ComponentFixture<LoanRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
