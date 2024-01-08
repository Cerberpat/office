import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingSplitComponent } from './shipping-split.component';

describe('ShippingSplitComponent', () => {
  let component: ShippingSplitComponent;
  let fixture: ComponentFixture<ShippingSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingSplitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
