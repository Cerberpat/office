import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWholesalersComponent } from './form-wholesalers.component';

describe('FormComponent', () => {
  let component: FormWholesalersComponent;
  let fixture: ComponentFixture<FormWholesalersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormWholesalersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWholesalersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
