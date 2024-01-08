import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilagesFormComponent } from './privilages-form.component';

describe('PrivilagesFormComponent', () => {
  let component: PrivilagesFormComponent;
  let fixture: ComponentFixture<PrivilagesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilagesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
