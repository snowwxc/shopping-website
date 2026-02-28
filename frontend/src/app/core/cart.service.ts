import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id?: number;
  sessionId?: string;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = '/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  
  cart$ = this.cartSubject.asObservable();
  cartItemCount$ = this.cart$.pipe(
    map(cart => cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0)
  );

  constructor(private http: HttpClient) { 
    this.refreshCart();
  }

  private refreshCart(): void {
    this.getCart().subscribe(cart => this.cartSubject.next(cart));
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addProductToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add/${productId}?quantity=${quantity}`, {}).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update/${productId}?quantity=${quantity}`, {}).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeProductFromCart(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/clear`, {}).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }
}
