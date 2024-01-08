import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilagesComponent } from './privilages.component';

describe('PrivilagesComponent', () => {
  let component: PrivilagesComponent;
  let fixture: ComponentFixture<PrivilagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
