import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositsSplitComponent } from './deposits-split.component';

describe('DepositsSplitComponent', () => {
  let component: DepositsSplitComponent;
  let fixture: ComponentFixture<DepositsSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositsSplitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
