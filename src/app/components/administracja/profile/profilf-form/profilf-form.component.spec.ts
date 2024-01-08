import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilfFormComponent } from './profilf-form.component';

describe('ProfilfFormComponent', () => {
  let component: ProfilfFormComponent;
  let fixture: ComponentFixture<ProfilfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilfFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
