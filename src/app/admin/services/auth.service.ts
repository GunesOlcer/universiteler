// src/app/admin/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    // Mock login kullanıcı: 'admin', şifre: 'admin123'
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        token: 'fake-jwt-token'
      };
      
      // Store user details and token in local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    
    return throwError('Kullanıcı adı veya şifre hatalı');
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return !!user;
  }
}