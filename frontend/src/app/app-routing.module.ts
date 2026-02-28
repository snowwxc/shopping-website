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
import { AboutArtistComponent } from './shop/about-artist/about-artist.component'; // Import AboutArtistComponent
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutArtistComponent }, // Add about route
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
  { path: 'shop/product/:id/ask', component: AskQuestionComponent },
  { path: 'shop/product/:id', component: ProductDetailComponent },
  { path: 'shop/products', component: ProductGalleryComponent },
  { path: 'shop/cart', component: CartComponent },
  { path: 'shop/checkout', component: CheckoutComponent },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'products', redirectTo: '/shop/products', pathMatch: 'full' },
  { path: 'cart', redirectTo: '/shop/cart', pathMatch: 'full' },
  { path: 'checkout', redirectTo: '/shop/checkout', pathMatch: 'full' },
  { path: '', redirectTo: '/shop/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
