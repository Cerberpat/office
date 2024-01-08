import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingWypComponent } from './marketing-wyp.component';

describe('MarketingWypComponent', () => {
  let component: MarketingWypComponent;
  let fixture: ComponentFixture<MarketingWypComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingWypComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingWypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
