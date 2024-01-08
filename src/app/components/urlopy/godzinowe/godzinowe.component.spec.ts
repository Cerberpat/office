import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodzinoweComponent } from './godzinowe.component';

describe('GodzinoweComponent', () => {
  let component: GodzinoweComponent;
  let fixture: ComponentFixture<GodzinoweComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodzinoweComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodzinoweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
