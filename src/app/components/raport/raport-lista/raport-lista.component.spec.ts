import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaportListaComponent } from './raport-lista.component';

describe('RaportListaComponent', () => {
  let component: RaportListaComponent;
  let fixture: ComponentFixture<RaportListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaportListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaportListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
