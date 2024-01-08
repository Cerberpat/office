import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingProfComponent } from './marketing-prof.component';

describe('MarketingProfComponent', () => {
  let component: MarketingProfComponent;
  let fixture: ComponentFixture<MarketingProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
