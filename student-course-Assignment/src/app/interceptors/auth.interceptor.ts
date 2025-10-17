import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true; // If we can't decode the token, consider it expired
  }
}

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Skip interceptor for login and refresh endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    console.log('🔓 Skipping auth interceptor for:', req.url);
    return next(req);
  }

  const token = authService.getToken();
  
  if (!token) {
    return next(req);
  }

  // Check if token is expired before making the request
  if (isTokenExpired(token)) {
    console.log('⏰ Token expired, refreshing before request...');
    return authService.refreshToken().pipe(
      switchMap(response => {
        console.log('✨ Token refreshed proactively');
        return next(addToken(req, response.accessToken));
      }),
      catchError(error => {
        console.error('❌ Token refresh failed:', error);
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  // Token is still valid, proceed with the request
  console.log('✅ Token valid, proceeding with request');
  req = addToken(req, token);
  return next(req);
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
}