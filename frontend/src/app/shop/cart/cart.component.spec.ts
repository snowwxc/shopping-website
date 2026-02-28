import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService, Cart } from '../../core/cart.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockCart: Cart = {
    items: [
      { id: 1, product: { id: 1, name: 'Product 1', description: 'desc1', price: 10, stock: 100 }, quantity: 2 },
      { id: 2, product: { id: 2, name: 'Product 2', description: 'desc2', price: 20, stock: 50 }, quantity: 1 }
    ]
  };

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'updateCartItemQuantity', 'removeProductFromCart', 'clearCart']);
    cartServiceSpy.getCart.and.returnValue(of(mockCart));
    cartServiceSpy.updateCartItemQuantity.and.returnValue(of(mockCart));
    cartServiceSpy.removeProductFromCart.and.returnValue(of(mockCart));
    cartServiceSpy.clearCart.and.returnValue(of(mockCart));

    await TestBed.configureTestingModule({
      declarations: [ CartComponent ],
      imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CartService, useValue: cartServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    expect(cartService.getCart).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.cartTotal).toBe(40); // (10 * 2) + (20 * 1)
  });

  it('should update quantity', () => {
    component.updateQuantity(1, 3);
    expect(cartService.updateCartItemQuantity).toHaveBeenCalledWith(1, 3);
    expect(cartService.getCart).toHaveBeenCalledTimes(2); // Initial + after update
  });

  it('should remove item', () => {
    component.removeItem(1);
    expect(cartService.removeProductFromCart).toHaveBeenCalledWith(1);
    expect(cartService.getCart).toHaveBeenCalledTimes(2); // Initial + after remove
  });

  it('should clear cart', () => {
    component.clearCart();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(cartService.getCart).toHaveBeenCalledTimes(2); // Initial + after clear
  });
});
