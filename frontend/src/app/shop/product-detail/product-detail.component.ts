import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service'; // Import CartService

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
    private cartService: CartService // Inject CartService
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
      this.cartService.addProductToCart(this.product.id).subscribe(
        cart => {
          console.log('Product added to cart:', cart);
          // Optionally, show a success message or update cart display
        },
        error => {
          console.error('Error adding product to cart:', error);
          // Handle error
        }
      );
    }
  }
}
