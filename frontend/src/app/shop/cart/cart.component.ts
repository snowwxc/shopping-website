import { Component, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '../../core/cart.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

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

  updateQuantity(productId: number, quantity: number, stock: number): void {
    if (quantity > stock) {
      this.snackBar.open(`Only ${stock} pieces available.`, 'Close', { duration: 3000 });
      return;
    }

    if (quantity > 0) {
      this.cartService.updateCartItemQuantity(productId, quantity).subscribe(() => {
        this.loadCart();
      }, error => {
        this.snackBar.open('Could not update quantity. Please check stock.', 'Close', { duration: 3000 });
      });
    } else {
      this.removeItem(productId);
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
