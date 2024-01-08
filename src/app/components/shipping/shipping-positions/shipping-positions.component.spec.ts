import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPositionsComponent } from './shipping-positions.component';

describe('ShippingPositionsComponent', () => {
  let component: ShippingPositionsComponent;
  let fixture: ComponentFixture<ShippingPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingPositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
