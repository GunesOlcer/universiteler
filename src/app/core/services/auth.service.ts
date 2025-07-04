import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { 
  LoginRequest,
  LoginCommandRequest,
  LoginCommandResponse,
  RegisterRequest,
  RegisterCommandRequest,
  RegisterCommandResponse,
  TokenResponse,
  CurrentUserResponse,
  AdminUserResponse,
  GetCurrentUserQueryResponse,
  ApiResponse,
  SingleResponse,
  AuthState
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null
  });

  public authState$ = this.authStateSubject.asObservable();
  public currentUser$ = this.authState$.pipe(map(state => state.user));
  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));

  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  constructor(
    http: HttpClient,
    private router: Router
  ) {
    super(http);
    this.initializeAuth();
  }

  private initializeAuth(): void {
    try {
      const token = this.getToken();
      const refreshToken = this.getRefreshToken();
      const storedUser = this.getStoredUser();
      
      console.log('🔐 [AuthService] Initializing auth:', { 
        hasToken: !!token, 
        hasRefreshToken: !!refreshToken, 
        hasUser: !!storedUser 
      });

      if (token && !this.isTokenExpired(token) && storedUser) {
        this.updateAuthState({
          isAuthenticated: true,
          user: storedUser,
          token: token,
          refreshToken: refreshToken
        });
        console.log('✅ [AuthService] Auth initialized successfully');
      } else {
        console.log('❌ [AuthService] Invalid stored auth data, clearing');
        this.clearAuth();
      }
    } catch (error) {
      console.error('❌ [AuthService] Error initializing auth:', error);
      this.clearAuth();
    }
  }

  // Regular user login
  login(request: LoginRequest): Observable<SingleResponse<TokenResponse>> {
    const loginCommand: LoginCommandRequest = {
      userName: request.userName,
      password: request.password,
      rememberMe: request.rememberMe || false
    };

    console.log('🔐 [AuthService] Regular login attempt for:', request.userName);

    return this.http.post<LoginCommandResponse>(`${this.baseUrl}/api/Auth/login`, loginCommand)
      .pipe(
        switchMap(response => {
          console.log('📡 [AuthService] Login response received:', response);
          
          if (response.success && response.data) {
            this.handleLoginSuccess(response.data);
            
            return this.loadCurrentUser().pipe(
              map(() => ({
                success: response.success,
                message: response.message,
                data: response.data
              })),
              catchError(userError => {
                console.warn('⚠️ [AuthService] Failed to load user details after login:', userError);
                return of({
                  success: response.success,
                  message: response.message,
                  data: response.data
                });
              })
            );
          } else {
            return of({
              success: response.success,
              message: response.message,
              data: response.data
            });
          }
        }),
        catchError(this.handleAuthError.bind(this))
      );
  }

  // Admin login
  adminLogin(request: LoginRequest): Observable<SingleResponse<TokenResponse>> {
    const loginCommand: LoginCommandRequest = {
      userName: request.userName,
      password: request.password,
      rememberMe: request.rememberMe || false
    };

    console.log('🔐 [AuthService] Admin login attempt for:', request.userName);

    return this.http.post<LoginCommandResponse>(`${this.baseUrl}/api/Auth/admin/login`, loginCommand)
      .pipe(
        switchMap(response => {
          console.log('📡 [AuthService] Admin login response received:', response);
          
          if (response.success && response.data) {
            this.handleLoginSuccess(response.data);
            
            return this.loadCurrentAdmin().pipe(
              map(() => ({
                success: response.success,
                message: response.message,
                data: response.data
              })),
              catchError(adminError => {
                console.warn('⚠️ [AuthService] Failed to load admin details after login:', adminError);
                return of({
                  success: response.success,
                  message: response.message,
                  data: response.data
                });
              })
            );
          } else {
            return of({
              success: response.success,
              message: response.message,
              data: response.data
            });
          }
        }),
        catchError(this.handleAuthError.bind(this))
      );
  }

  // Register
  register(request: RegisterRequest): Observable<SingleResponse<any>> {
    const registerCommand: RegisterCommandRequest = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phoneNumber: request.phoneNumber,
      userName: request.userName,
      password: request.password,
      confirmPassword: request.confirmPassword,
      birthDate: request.birthDate
    };

    console.log('📝 [AuthService] Register attempt for:', request.userName);

    return this.http.post<RegisterCommandResponse>(`${this.baseUrl}/api/Auth/register`, registerCommand)
      .pipe(
        map(response => ({
          success: response.success,
          message: response.message,
          data: response.data
        })),
        catchError(this.handleAuthError.bind(this))
      );
  }

  // Get current user
  getCurrentUser(): Observable<SingleResponse<CurrentUserResponse>> {
    console.log('👤 [AuthService] Getting current user');
    
    return this.http.get<GetCurrentUserQueryResponse>(`${this.baseUrl}/api/Auth/current-user`, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('📡 [AuthService] Current user response:', response);
          if (response.success && response.data) {
            this.updateUser(response.data);
          }
        }),
        map(response => ({
          success: response.success,
          message: response.message,
          data: response.data
        })),
        catchError(this.handleAuthError.bind(this))
      );
  }

  // Get current admin
  getCurrentAdmin(): Observable<SingleResponse<AdminUserResponse>> {
    console.log('👑 [AuthService] Getting current admin');
    
    return this.http.get<SingleResponse<AdminUserResponse>>(`${this.baseUrl}/api/Auth/current-admin`, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('📡 [AuthService] Current admin response:', response);
          if (response.success && response.data) {
            this.updateUser(response.data);
          }
        }),
        catchError(this.handleAuthError.bind(this))
      );
  }

  // Logout
  logout(): Observable<any> {
    console.log('🚪 [AuthService] Logout initiated');
    
    const hasToken = !!this.getToken();
    
    if (hasToken) {
      return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/Auth/logout`, {}, this.getHttpOptions())
        .pipe(
          tap(() => {
            console.log('✅ [AuthService] Server logout successful');
            this.clearAuth();
            this.router.navigate(['/admin/login']);
          }),
          catchError(error => {
            console.warn('⚠️ [AuthService] Server logout failed, clearing local auth anyway:', error);
            this.clearAuth();
            this.router.navigate(['/admin/login']);
            return of(null);
          })
        );
    } else {
      this.clearAuth();
      this.router.navigate(['/admin/login']);
      return of(null);
    }
  }

  // Refresh token
  refreshToken(): Observable<SingleResponse<TokenResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('❌ [AuthService] No refresh token available');
      return throwError(() => new Error('No refresh token available'));
    }

    console.log('🔄 [AuthService] Refreshing token');

    return this.http.post<SingleResponse<TokenResponse>>(`${this.baseUrl}/api/Auth/refresh-token`, 
      `"${refreshToken}"`,
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getToken()}` } })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            console.log('✅ [AuthService] Token refreshed successfully');
            this.handleLoginSuccess(response.data);
          }
        }),
        catchError(error => {
          console.error('❌ [AuthService] Token refresh failed:', error);
          this.clearAuth();
          this.router.navigate(['/admin/login']);
          return throwError(() => error);
        })
      );
  }

  // Token management
  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.refreshTokenKey);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isValid = !!token && !this.isTokenExpired(token);
    return isValid;
  }

  isAdmin(): boolean {
    const user = this.authStateSubject.value.user;
    const isAdmin = !!(user && 'roles' in user && user.roles?.includes('Admin'));
    return isAdmin;
  }

  getCurrentUserValue(): CurrentUserResponse | AdminUserResponse | null {
    return this.authStateSubject.value.user;
  }

  // Private methods
  private handleLoginSuccess(tokenData: TokenResponse): void {
    console.log('✅ [AuthService] Handling login success');
    this.setTokens(tokenData.accessToken, tokenData.refreshToken);
    
    this.updateAuthState({
      isAuthenticated: true,
      user: this.authStateSubject.value.user,
      token: tokenData.accessToken,
      refreshToken: tokenData.refreshToken
    });
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    try {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
      console.log('✅ [AuthService] Tokens stored successfully');
    } catch (error) {
      console.error('❌ [AuthService] Error storing tokens:', error);
    }
  }

  private clearTokens(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      console.log('🗑️ [AuthService] Tokens cleared');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  private storeUser(user: CurrentUserResponse | AdminUserResponse): void {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
      console.log('✅ [AuthService] User stored successfully');
    } catch (error) {
      console.error('❌ [AuthService] Error storing user:', error);
    }
  }

  private getStoredUser(): CurrentUserResponse | AdminUserResponse | null {
    try {
      const stored = localStorage.getItem(this.userKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  private clearUser(): void {
    try {
      localStorage.removeItem(this.userKey);
      console.log('🗑️ [AuthService] User data cleared');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }

  private clearAuth(): void {
    console.log('🗑️ [AuthService] Clearing all auth data');
    this.clearTokens();
    this.clearUser();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null
    });
  }

  private updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
    console.log('🔄 [AuthService] Auth state updated:', newState);
  }

  private updateUser(user: CurrentUserResponse | AdminUserResponse): void {
    this.storeUser(user);
    const currentState = this.authStateSubject.value;
    this.updateAuthState({
      ...currentState,
      user: user
    });
  }

  private loadCurrentUser(): Observable<SingleResponse<CurrentUserResponse>> {
    return this.getCurrentUser();
  }

  private loadCurrentAdmin(): Observable<SingleResponse<AdminUserResponse>> {
    return this.getCurrentAdmin();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const isExpired = Date.now() >= expirationTime;
      return isExpired;
    } catch (error) {
      console.error('❌ [AuthService] Error parsing token:', error);
      return true;
    }
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Bir hata oluştu';
    
    console.error('❌ [AuthService] Auth error details:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message
    });
    
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.success === false && error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.status === 401) {
      errorMessage = 'Kullanıcı adı veya şifre hatalı';
    } else if (error.status === 403) {
      errorMessage = 'Bu işlem için yetkiniz bulunmamaktadır';
    } else if (error.status === 0) {
      errorMessage = 'Sunucuya bağlanılamıyor';
    } else if (error.status >= 500) {
      errorMessage = 'Sunucu hatası';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}