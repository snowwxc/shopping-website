import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ProductListComponent } from '../product-list/product-list.component'; // Import ProductListComponent
import { MatTableModule } from '@angular/material/table'; // Needed for ProductListComponent
import { RouterTestingModule } from '@angular/router/testing'; // Needed for routerLink
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        ProductListComponent // Declare ProductListComponent
      ],
      imports: [
        MatTableModule, // Add MatTableModule
        RouterTestingModule, // Add RouterTestingModule
        HttpClientTestingModule // Add HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
