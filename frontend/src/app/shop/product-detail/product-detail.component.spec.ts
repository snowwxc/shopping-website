import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs'; // Import BehaviorSubject
import { ProductDetailComponent } from './product-detail.component';
import { Product, ProductService } from '../../core/product.service';
import { CartService, Cart } from '../../core/cart.service'; // Import CartService
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionListComponent } from '../../shared/question-list/question-list.component'; // Import QuestionListComponent
import { MatExpansionModule } from '@angular/material/expansion'; // For QuestionListComponent
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For QuestionListComponent

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: Router;
  let paramMapSubject: BehaviorSubject<any>; // Declare BehaviorSubject

  const mockProduct: Product = { id: 1, name: 'Test Product', description: 'desc', price: 10, stock: 100 };
  const mockCart: Cart = { items: [] };

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: '1' })); // Initialize BehaviorSubject

    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));

    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addProductToCart']);
    cartServiceSpy.addProductToCart.and.returnValue(of(mockCart));

    await TestBed.configureTestingModule({
      declarations: [
        ProductDetailComponent,
        QuestionListComponent
      ],
      imports: [
        MatCardModule,
        MatButtonModule,
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
            paramMap: paramMapSubject.asObservable() // Use asObservable
          }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
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
    paramMapSubject.next(convertToParamMap({})); // Update paramMap
    fixture.detectChanges(); // Re-trigger ngOnInit
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should call addToCart', () => {
    component.product = mockProduct;
    component.addToCart();
    expect(cartService.addProductToCart).toHaveBeenCalledWith(mockProduct.id!);
  });
});
