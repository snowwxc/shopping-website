import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service'; // Re-use Product interface

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

  private apiUrl = '/api/cart'; // Proxy will redirect this to the backend

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addProductToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add/${productId}?quantity=${quantity}`, {});
  }

  updateCartItemQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update/${productId}?quantity=${quantity}`, {});
  }

  removeProductFromCart(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`);
  }

  clearCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/clear`, {});
  }
}
