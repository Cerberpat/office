import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlikiComponent } from './pliki.component';

describe('PlikiComponent', () => {
  let component: PlikiComponent;
  let fixture: ComponentFixture<PlikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
