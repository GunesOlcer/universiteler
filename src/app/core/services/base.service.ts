import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  public readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected getHttpOptions(): { headers: HttpHeaders } {
    const token = this.getTokenFromStorage();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  protected getHttpOptionsForFormData(): { headers: HttpHeaders } {
    const token = this.getTokenFromStorage();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  private getTokenFromStorage(): string | null {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔑 [BaseService] Getting token from storage:', !!token);
      return token;
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  }

  protected buildFormData(data: any): FormData {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item.toString());
          });
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          // Don't append empty strings
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }

  protected buildHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
    
    return httpParams;
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Bir hata oluştu';
    
    console.error('HTTP Error:', error);
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = (validationErrors as string[]).join(', ');
        }
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.status === 0) {
        errorMessage = 'Sunucuya bağlanılamıyor';
      } else if (error.status === 401) {
        errorMessage = 'Yetkisiz erişim';
      } else if (error.status === 403) {
        errorMessage = 'Erişim yasak';
      } else if (error.status === 404) {
        errorMessage = 'İstenen kaynak bulunamadı';
      } else if (error.status === 500) {
        errorMessage = 'Sunucu hatası';
      } else {
        errorMessage = `HTTP ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  protected getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/default-city.jpg';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Fix: Remove the trailing slash from baseUrl and add proper path
    const cleanBaseUrl = this.baseUrl.replace(/\/$/, '');
    const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${cleanBaseUrl}${cleanImagePath}`;
  }
}