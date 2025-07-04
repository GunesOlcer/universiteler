import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  validateToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Diagnostic/validate-token`, token);
  }

  getJwtConfig(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Diagnostic/jwt-config`);
  }

  analyzeToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/JwtDiagnostic/analyze-token`, token);
  }
}