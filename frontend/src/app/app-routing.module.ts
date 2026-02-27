import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductCreateEditComponent } from './admin/product-create-edit/product-create-edit.component';
import { OrderListComponent } from './admin/order-list/order-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/products/new', component: ProductCreateEditComponent },
  { path: 'admin/products/:id/edit', component: ProductCreateEditComponent },
  { path: 'admin/orders', component: OrderListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
