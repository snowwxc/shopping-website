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
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin/dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/products/new', 
    component: ProductCreateEditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/products/:id/edit', 
    component: ProductCreateEditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/orders', 
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/questions', 
    component: QuestionListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'products/:id/ask', component: AskQuestionComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductGalleryComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
