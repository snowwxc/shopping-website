import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { CartService, Cart } from '../../core/cart.service';
import { ProductService } from '../../core/product.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let productService: jasmine.SpyObj<ProductService>;
  let httpClient: jasmine.SpyObj<HttpClient>;
  let router: Router;

  const mockCart: Cart = {
    items: [
      { id: 1, product: { id: 1, name: 'Product 1', description: 'desc1', price: 10, stock: 100 }, quantity: 2 }
    ]
  };

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'clearCart']);
    cartServiceSpy.getCart.and.returnValue(of(mockCart));
    cartServiceSpy.clearCart.and.returnValue(of({ items: [] }));

    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({ id: 123 })); // Mock successful checkout response

    await TestBed.configureTestingModule({
      declarations: [ CheckoutComponent ],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    httpClient = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart and calculate total on init', () => {
    expect(cartService.getCart).toHaveBeenCalled();
    expect(component.cartTotal).toBe(20);
  });

  it('should call checkout API and navigate on submit', () => {
    component.checkoutForm.setValue({
      customerName: 'John Doe',
      customerAddress: '123 Main St'
    });
    component.onSubmit();

    expect(httpClient.post).toHaveBeenCalled();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/order-confirmation']);
  });
});
