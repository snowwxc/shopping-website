import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { MatSnackBar } from '@angular/material/snack-bar'; // For displaying user-friendly messages

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(/* private snackBar: MatSnackBar */) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          if (error.status) {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && typeof error.error === 'object' && error.error.message) {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
            } else if (error.error && typeof error.error === 'string') {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
          }
        }
        console.error(errorMessage);
        // this.snackBar.open(errorMessage, 'Close', { duration: 5000 }); // Display error message
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
