import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormZadanieComponent } from './form-zadanie.component';

describe('FormZadanieComponent', () => {
  let component: FormZadanieComponent;
  let fixture: ComponentFixture<FormZadanieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormZadanieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormZadanieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
