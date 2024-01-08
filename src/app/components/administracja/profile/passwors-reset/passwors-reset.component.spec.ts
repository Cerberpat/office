import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassworsResetComponent } from './passwors-reset.component';

describe('PassworsResetComponent', () => {
  let component: PassworsResetComponent;
  let fixture: ComponentFixture<PassworsResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassworsResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassworsResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
