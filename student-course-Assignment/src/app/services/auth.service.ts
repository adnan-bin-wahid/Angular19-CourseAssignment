import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth';
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'user_info';
  private readonly tokenExpiration = 1; // 1 minute expiration for testing, minimum allowed by the API
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticatedSubject.next(!!token);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        username,
        password,
        expiresInMins: this.tokenExpiration
      }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        localStorage.setItem(this.userKey, JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image
        }));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(
      `${this.apiUrl}/refresh`,
      {
        refreshToken,
        expiresInMins: this.tokenExpiration
      }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      })
    );
  }

  getUserInfo() {
    const userInfo = localStorage.getItem(this.userKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  private hasValidToken(): boolean {
    return !!this.getToken();
  }
}