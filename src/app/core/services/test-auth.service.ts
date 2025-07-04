import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TestAuthService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  debugHeaders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/debug-headers`);
  }

  testAnonymous(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/anonymous`);
  }

  testAuthenticated(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/authenticated`);
  }

  testAdmin(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/admin`);
  }

  testAdminOrSuperAdmin(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/admin-or-superadmin`);
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/user-info`);
  }

  testTokenGeneration(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/test-token-generation`);
  }

  validateCurrentToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/validate-current-token`);
  }

  getVerificationSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/verification-summary`);
  }

  completeTest(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/TestAuth/complete-test`);
  }
}