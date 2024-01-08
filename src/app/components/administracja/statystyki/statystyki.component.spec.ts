import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatystykiComponent } from './statystyki.component';

describe('StatystykiComponent', () => {
  let component: StatystykiComponent;
  let fixture: ComponentFixture<StatystykiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatystykiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatystykiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
