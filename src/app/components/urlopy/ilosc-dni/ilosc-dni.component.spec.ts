import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IloscDniComponent } from './ilosc-dni.component';

describe('IloscDniComponent', () => {
  let component: IloscDniComponent;
  let fixture: ComponentFixture<IloscDniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IloscDniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IloscDniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
