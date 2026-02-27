import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductCreateEditComponent } from './admin/product-create-edit/product-create-edit.component';
import { OrderListComponent } from './admin/order-list/order-list.component';
import { QuestionListComponent } from './shared/question-list/question-list.component';
import { AskQuestionComponent } from './shop/ask-question/ask-question.component';
import { ProductGalleryComponent } from './shop/product-gallery/product-gallery.component';
import { ProductDetailComponent } from './shop/product-detail/product-detail.component';
import { CartComponent } from './shop/cart/cart.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/products/new', component: ProductCreateEditComponent },
  { path: 'admin/products/:id/edit', component: ProductCreateEditComponent },
  { path: 'admin/orders', component: OrderListComponent },
  { path: 'admin/questions', component: QuestionListComponent },
  { path: 'products/:id/ask', component: AskQuestionComponent },
  { path: 'products/:id', component: ProductDetailComponent }, // Specific product detail
  { path: 'products', component: ProductGalleryComponent }, // Main product browsing page
  { path: 'cart', component: CartComponent }, // Shopping Cart page
  { path: '', redirectTo: '/products', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
