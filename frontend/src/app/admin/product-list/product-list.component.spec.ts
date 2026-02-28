import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { Product, ProductService } from '../../core/product.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 1, name: 'Product 1', description: 'desc1', price: 10, stock: 100 },
    { id: 2, name: 'Product 2', description: 'desc2', price: 20, stock: 50 }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productServiceSpy.deleteProduct.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [ ProductListComponent ],
      imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockProducts);
  });
});
