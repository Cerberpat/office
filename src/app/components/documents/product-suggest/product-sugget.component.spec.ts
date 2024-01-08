import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSuggestComponent } from './product-suggest.component';

describe('ProductSuggetComponent', () => {
  let component: ProductSuggestComponent;
  let fixture: ComponentFixture<ProductSuggestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSuggestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
