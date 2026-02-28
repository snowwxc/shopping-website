import { Component, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '../../core/cart.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'quantity', 'price', 'total', 'actions'];
  dataSource = new MatTableDataSource<CartItem>();
  cartTotal: number = 0;
  taxRate: number = 0.06; // 6% Michigan Sales Tax
  taxAmount: number = 0;
  grandTotal: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(cart => {
      this.dataSource.data = cart.items || [];
      this.calculateTotals();
    }, error => {
      console.error('Error loading cart:', error);
      this.dataSource.data = [];
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.cartTotal = this.dataSource.data.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
    this.taxAmount = this.cartTotal * this.taxRate;
    this.grandTotal = this.cartTotal + this.taxAmount;
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateCartItemQuantity(productId, quantity).subscribe(() => {
        this.loadCart();
      });
    } else {
      this.removeItem(productId); // If quantity is 0 or less, remove the item
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeProductFromCart(productId).subscribe(() => {
      this.loadCart();
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
    });
  }
}
