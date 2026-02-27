import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service'; // Import CartService
import { ProductService } from '../../core/product.service'; // For product details in cart items
import { HttpClient } from '@angular/common/http'; // For backend checkout call

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartTotal: number = 0; // Display cart total if needed

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService, // To display product details in cart
    private http: HttpClient // For the final checkout call
  ) {
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required]
      // Add payment fields later for Stripe integration
    });
  }

  // Getters for easy access to form controls
  get customerName() { return this.checkoutForm.get('customerName'); }
  get customerAddress() { return this.checkoutForm.get('customerAddress'); }

  ngOnInit(): void {
    // Optionally load cart details to display in checkout summary
    this.cartService.getCart().subscribe(cart => {
      this.cartTotal = cart.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const customerName = this.checkoutForm.value.customerName;
      const customerAddress = this.checkoutForm.value.customerAddress;

      // This part will be updated with Stripe integration later
      console.log('Placing order for:', customerName, 'to', customerAddress);

      // Call backend checkout API
      this.http.post('/api/orders/checkout', null, {
        params: {
          customerName: customerName,
          customerAddress: customerAddress
        }
      }).subscribe(
        response => {
          console.log('Order placed successfully!', response);
          this.cartService.clearCart().subscribe(() => {
            this.router.navigate(['/order-confirmation']); // Navigate to confirmation page
          });
        },
        error => {
          console.error('Error placing order:', error);
          // Handle error (e.g., show error message)
        }
      );
    }
  }
}
