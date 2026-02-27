import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductCreateEditComponent } from './product-create-edit.component';
import { ProductService, Product } from '../../core/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductCreateEditComponent', () => {
  let component: ProductCreateEditComponent;
  let fixture: ComponentFixture<ProductCreateEditComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: Router;

  const mockProduct: Product = { id: 1, name: 'Test Product', description: 'desc', price: 10, stock: 100 };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct', 'createProduct', 'updateProduct']);
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));
    productServiceSpy.createProduct.and.returnValue(of(mockProduct));
    productServiceSpy.updateProduct.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      declarations: [ ProductCreateEditComponent ],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreateEditComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be in create mode by default', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeFalse();
  });

  it('should be in edit mode when an id is present in the route', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    (activatedRoute as any).paramMap = of(convertToParamMap({ id: '1' }));
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    expect(productService.getProduct).toHaveBeenCalledWith(1);
  });

  it('should call createProduct on submit in create mode and navigate', () => {
    fixture.detectChanges();
    component.productForm.setValue(mockProduct);
    component.onSubmit();
    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should call updateProduct on submit in edit mode and navigate', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    (activatedRoute as any).paramMap = of(convertToParamMap({ id: '1' }));
    fixture.detectChanges();
    component.productForm.setValue(mockProduct);
    component.onSubmit();
    expect(productService.updateProduct).toHaveBeenCalledWith(1, mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });
});
