import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodatkowyAdresComponent } from './dodatkowy-adres.component';

describe('DodatkowyAdresComponent', () => {
  let component: DodatkowyAdresComponent;
  let fixture: ComponentFixture<DodatkowyAdresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodatkowyAdresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodatkowyAdresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
