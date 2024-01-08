import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWypComponent } from './edit-wyp.component';

describe('EditWypComponent', () => {
  let component: EditWypComponent;
  let fixture: ComponentFixture<EditWypComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWypComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
