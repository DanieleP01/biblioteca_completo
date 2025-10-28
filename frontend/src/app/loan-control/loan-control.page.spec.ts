import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanControlPage } from './loan-control.page';

describe('LoanControlPage', () => {
  let component: LoanControlPage;
  let fixture: ComponentFixture<LoanControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
