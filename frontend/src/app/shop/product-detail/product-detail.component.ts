import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../core/product.service';

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
    private productService: ProductService
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
    // Implement add to cart logic later
    console.log('Add to cart clicked for product:', this.product?.name);
  }
}
