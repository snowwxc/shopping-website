import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  orderDate: Date;
}

const ELEMENT_DATA: Order[] = [
  { id: 1, customerName: 'Alice Smith', totalAmount: 250.00, orderDate: new Date('2026-01-15T10:00:00Z') },
  { id: 2, customerName: 'Bob Johnson', totalAmount: 50.00, orderDate: new Date('2026-01-20T14:30:00Z') },
  { id: 3, customerName: 'Charlie Brown', totalAmount: 120.00, orderDate: new Date('2026-01-25T09:15:00Z') },
];

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customerName', 'totalAmount', 'orderDate'];
  dataSource = new MatTableDataSource<Order>(ELEMENT_DATA); // Initialize with MatTableDataSource

  constructor() { }

  ngOnInit(): void {
  }
}
