import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductGalleryComponent } from './product-gallery.component';
import { Product, ProductService } from '../../core/product.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductGalleryComponent', () => {
  let component: ProductGalleryComponent;
  let fixture: ComponentFixture<ProductGalleryComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Product 1', description: 'Desc 1', price: 10, stock: 5 },
    { id: 2, name: 'Product 2', description: 'Desc 2', price: 20, stock: 10 }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      declarations: [ ProductGalleryComponent ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        CurrencyPipe
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGalleryComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.allProducts).toEqual(mockProducts);
  });

  it('should display product cards', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-card').length).toBe(mockProducts.length);
    expect(compiled.textContent).toContain('Product 1');
    expect(compiled.textContent).toContain('Product 2');
  });
});
