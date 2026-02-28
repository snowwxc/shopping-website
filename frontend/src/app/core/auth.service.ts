import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  login(credentials: any): Observable<any> {
    // For Basic Auth, the "token" is the base64 encoded username:password
    const token = btoa(`${credentials.username}:${credentials.password}`);
    
    // Test the token by making a call to a protected endpoint
    return this.http.get('/api/orders', {
      headers: { 'Authorization': `Basic ${token}` }
    }).pipe(
      tap(() => {
        localStorage.setItem('auth_token', token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
