import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingArchiveComponent } from './shipping-archive.component';

describe('ShippingArchiveComponent', () => {
  let component: ShippingArchiveComponent;
  let fixture: ComponentFixture<ShippingArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
