import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyRequestControlPage } from './copyrequest-control.page';

describe('CopyrequestControlPage', () => {
  let component: CopyRequestControlPage;
  let fixture: ComponentFixture<CopyRequestControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyRequestControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
