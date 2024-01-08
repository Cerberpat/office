import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WypPozComponent } from './wyp-poz.component';

describe('WypPozComponent', () => {
  let component: WypPozComponent;
  let fixture: ComponentFixture<WypPozComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WypPozComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WypPozComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
