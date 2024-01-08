import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMagComponent } from './marketing-mag.component';

describe('MarketingMagComponent', () => {
  let component: MarketingMagComponent;
  let fixture: ComponentFixture<MarketingMagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingMagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
