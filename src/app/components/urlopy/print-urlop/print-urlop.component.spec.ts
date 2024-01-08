import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUrlopComponent } from './print-urlop.component';

describe('PrintUrlopComponent', () => {
  let component: PrintUrlopComponent;
  let fixture: ComponentFixture<PrintUrlopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintUrlopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintUrlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
