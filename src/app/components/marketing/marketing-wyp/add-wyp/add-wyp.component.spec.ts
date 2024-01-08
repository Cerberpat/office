import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWypComponent } from './add-wyp.component';

describe('AddWypComponent', () => {
  let component: AddWypComponent;
  let fixture: ComponentFixture<AddWypComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWypComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
