import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositsSplitPositionsComponent } from './deposits-split-positions.component';

describe('DepositsSplitPositionsComponent', () => {
  let component: DepositsSplitPositionsComponent;
  let fixture: ComponentFixture<DepositsSplitPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositsSplitPositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsSplitPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
