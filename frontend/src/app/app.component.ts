import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CartService } from './core/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn$: Observable<boolean>;
  cartItemCount$: Observable<number>;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.cartItemCount$ = this.cartService.cartItemCount$;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}
