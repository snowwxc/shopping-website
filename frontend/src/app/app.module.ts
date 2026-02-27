import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { ProductCreateEditComponent } from './admin/product-create-edit/product-create-edit.component';
import { OrderListComponent } from './admin/order-list/order-list.component';
import { QuestionListComponent } from './shared/question-list/question-list.component';
import { AskQuestionComponent } from './shop/ask-question/ask-question.component';
import { ProductGalleryComponent } from './shop/product-gallery/product-gallery.component';
import { ProductDetailComponent } from './shop/product-detail/product-detail.component';
import { CartComponent } from './shop/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductListComponent,
    ProductCreateEditComponent,
    OrderListComponent,
    QuestionListComponent,
    AskQuestionComponent,
    ProductGalleryComponent,
    ProductDetailComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
