import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';
import { Product, ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionListComponent } from '../../shared/question-list/question-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: Router;
  let paramMapSubject: BehaviorSubject<any>;

  const mockProduct: Product = { id: 1, name: 'Test Product', description: 'desc', price: 10, stock: 100 };

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: '1' }));

    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));

    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addProductToCart'], {
      cartItemCount$: of(0)
    });
    cartServiceSpy.addProductToCart.and.returnValue(of({ items: [] }));

    await TestBed.configureTestingModule({
      declarations: [
        ProductDetailComponent,
        QuestionListComponent
      ],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatExpansionModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable()
          }
        },
        CurrencyPipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product details on init', () => {
    expect(productService.getProduct).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
  });

  it('should navigate to products if no id is provided', () => {
    spyOn(router, 'navigate');
    paramMapSubject.next(convertToParamMap({}));
    fixture.detectChanges();
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call addToCart', () => {
    component.product = mockProduct;
    component.addToCart();
    expect(cartService.addProductToCart).toHaveBeenCalledWith(mockProduct.id!);
  });
});
