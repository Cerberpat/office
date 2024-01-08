import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZmianyIlosciComponent } from './zmiany-ilosci.component';

describe('ZmianyIlosciComponent', () => {
  let component: ZmianyIlosciComponent;
  let fixture: ComponentFixture<ZmianyIlosciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZmianyIlosciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZmianyIlosciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
