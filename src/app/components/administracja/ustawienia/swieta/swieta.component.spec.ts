import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwietaComponent } from './swieta.component';

describe('SwietaComponent', () => {
  let component: SwietaComponent;
  let fixture: ComponentFixture<SwietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
