import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrzelozeniComponent } from './przelozeni.component';

describe('PrzelozeniComponent', () => {
  let component: PrzelozeniComponent;
  let fixture: ComponentFixture<PrzelozeniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrzelozeniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrzelozeniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
