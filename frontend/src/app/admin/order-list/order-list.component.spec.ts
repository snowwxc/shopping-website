import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent, Order } from './order-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderListComponent ],
      imports: [
        MatTableModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display orders', fakeAsync(() => {
    const mockOrders: Order[] = [
      { id: 1, customerName: 'Test Customer 1', totalAmount: 100, orderDate: new Date() },
      { id: 2, customerName: 'Test Customer 2', totalAmount: 200, orderDate: new Date() }
    ];
    component.dataSource.data = mockOrders;
    fixture.detectChanges();

    tick();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Customer 1');
    expect(compiled.textContent).toContain('Test Customer 2');
    expect(compiled.textContent).toContain('100'); // Check total amount
    expect(compiled.textContent).toContain('200'); // Check total amount
  }));
});
