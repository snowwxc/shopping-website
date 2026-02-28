import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../core/product.service';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css']
})
export class ProductGalleryComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  pageSize = 6;
  currentPage = 1;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.updateDisplayedProducts();
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(): void {
    this.displayedProducts = this.allProducts.slice(0, this.currentPage * this.pageSize);
  }

  get hasMore(): boolean {
    return this.displayedProducts.length < this.allProducts.length;
  }
}
