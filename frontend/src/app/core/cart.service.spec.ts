import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService, Cart } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the cart', () => {
    const mockCart: Cart = { items: [] };
    service.getCart().subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should add a product to the cart', () => {
    const mockCart: Cart = { items: [] };
    service.addProductToCart(1, 2).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/add/1?quantity=2');
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });

  it('should update cart item quantity', () => {
    const mockCart: Cart = { items: [] };
    service.updateCartItemQuantity(1, 3).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/update/1?quantity=3');
    expect(req.request.method).toBe('PUT');
    req.flush(mockCart);
  });

  it('should remove a product from the cart', () => {
    const mockCart: Cart = { items: [] };
    service.removeProductFromCart(1).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/remove/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCart);
  });

  it('should clear the cart', () => {
    const mockCart: Cart = { items: [] };
    service.clearCart().subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('/api/cart/clear');
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });
});
