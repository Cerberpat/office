import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMagComponent } from './edit-mag.component';

describe('EditMagComponent', () => {
  let component: EditMagComponent;
  let fixture: ComponentFixture<EditMagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
