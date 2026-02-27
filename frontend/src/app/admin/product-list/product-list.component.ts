import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../core/product.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'price', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.dataSource.data = products;
    });
  }
}
