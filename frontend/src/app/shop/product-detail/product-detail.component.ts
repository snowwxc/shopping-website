import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productService.getProduct(+id).subscribe(product => {
          this.product = product;
        });
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart(): void {
    if (this.product && this.product.id) {
      const currentInCart = this.cartService.getCartItemQuantity(this.product.id);
      if (currentInCart >= (this.product.stock || 0)) {
        this.snackBar.open(`Cannot add more. only ${this.product.stock} available.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        return;
      }

      this.cartService.addProductToCart(this.product.id).subscribe(
        cart => {
          // No success message as requested
        },
        error => {
          this.snackBar.open('Could not add to cart. Please check stock.', 'Close', { duration: 3000 });
        }
      );
    }
  }
}
