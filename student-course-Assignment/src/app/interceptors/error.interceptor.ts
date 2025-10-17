import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        console.error('🔥 API Error:', error);

        switch (error.status) {
          case 400:
            console.error('Bad Request:', error.error?.message || 'Invalid request');
            break;

          case 401:
            console.error('Unauthorized:', error.error?.message || 'Authentication required');
            // Only redirect to login if we're not already there and not trying to refresh token
            if (!router.url.includes('/login') && !req.url.includes('/auth/refresh')) {
              router.navigate(['/login']);
            }
            break;

          case 403:
            console.error('Forbidden:', error.error?.message || 'Access denied');
            break;

          case 404:
            console.error('Not Found:', error.error?.message || 'Resource not found');
            break;

          case 500:
            console.error('Server Error:', error.error?.message || 'Internal server error');
            break;

          default:
            console.error(
              `Error ${error.status}:`,
              error.error?.message || 'Something went wrong'
            );
        }

        // You can add a toast/snackbar notification service here
        // Example: this.notificationService.showError(error.error?.message || 'An error occurred');
      }

      // Rethrow the error so components can still handle it if needed
      return throwError(() => error);
    })
  );
};