import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodzinyNadliczboweComponent } from './godziny-nadliczbowe.component';

describe('GodzinyNadliczboweComponent', () => {
  let component: GodzinyNadliczboweComponent;
  let fixture: ComponentFixture<GodzinyNadliczboweComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GodzinyNadliczboweComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GodzinyNadliczboweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
