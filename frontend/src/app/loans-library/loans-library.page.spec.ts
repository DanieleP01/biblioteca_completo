import { ComponentFixture, TestBed } from '@angular/core/testing';
import { loanslibrary } from './loans-library.page';

describe('loans-library', () => {
  let component: loanslibrary;
  let fixture: ComponentFixture<loanslibrary>;

  beforeEach(() => {
    fixture = TestBed.createComponent(loanslibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
