import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MybooksPage } from './mybooks.page';

describe('MybooksPage', () => {
  let component: MybooksPage;
  let fixture: ComponentFixture<MybooksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MybooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
