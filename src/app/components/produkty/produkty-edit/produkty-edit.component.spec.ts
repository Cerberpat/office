import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduktyEditComponent } from './produkty-edit.component';

describe('ProduktyEditComponent', () => {
  let component: ProduktyEditComponent;
  let fixture: ComponentFixture<ProduktyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduktyEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduktyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
