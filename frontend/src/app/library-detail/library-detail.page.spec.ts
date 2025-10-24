import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryDetailPage } from './library-detail.page';

describe('LibraryDetailPage', () => {
  let component: LibraryDetailPage;
  let fixture: ComponentFixture<LibraryDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
