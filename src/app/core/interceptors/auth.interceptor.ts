import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔗 [AuthInterceptor] Intercepting request:', req.url);
    
    // Add auth header if token exists and it's not an auth endpoint
    let authReq = req;
    const token = this.authService.getToken();
    
    if (token && !this.isAuthUrl(req.url)) {
      authReq = this.addTokenHeader(req, token);
      console.log('🔑 [AuthInterceptor] Token added to request');
    } else {
      console.log('🔓 [AuthInterceptor] No token added - auth URL or no token available');
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        console.error('❌ [AuthInterceptor] Request error:', {
          url: req.url,
          status: error.status,
          message: error.message
        });

        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isAuthUrl(req.url)) {
          console.log('🔄 [AuthInterceptor] 401 error on protected endpoint, attempting token refresh');
          return this.handle401Error(authReq, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private isAuthUrl(url: string): boolean {
    const authUrls = [
      '/api/Auth/login',
      '/api/Auth/admin/login',
      '/api/Auth/register',
      '/api/Auth/refresh-token'
    ];
    
    return authUrls.some(authUrl => url.includes(authUrl));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      
      if (refreshToken) {
        console.log('🔄 [AuthInterceptor] Attempting to refresh token');
        
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            if (response && response.success) {
              console.log('✅ [AuthInterceptor] Token refresh successful');
              this.refreshTokenSubject.next(response.data.accessToken);
              return next.handle(this.addTokenHeader(request, response.data.accessToken));
            }
            console.error('❌ [AuthInterceptor] Token refresh failed');
            this.authService.logout().subscribe();
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            console.error('❌ [AuthInterceptor] Token refresh error, logging out');
            this.authService.logout().subscribe();
            return throwError(() => err);
          })
        );
      } else {
        console.log('❌ [AuthInterceptor] No refresh token available, logging out');
        this.isRefreshing = false;
        this.authService.logout().subscribe();
        return throwError(() => new Error('No refresh token available'));
      }
    }

    console.log('⏳ [AuthInterceptor] Waiting for token refresh to complete');
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
}