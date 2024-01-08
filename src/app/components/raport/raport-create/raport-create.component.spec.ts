import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaportCreateComponent } from './raport-create.component';

describe('RaportCreateComponent', () => {
  let component: RaportCreateComponent;
  let fixture: ComponentFixture<RaportCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaportCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
