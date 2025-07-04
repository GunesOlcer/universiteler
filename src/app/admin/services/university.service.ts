// src/app/admin/services/university.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private apiUrl = `${environment.apiUrl}/universities`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockUniversities = [
    { id: 1, name: 'Boğaziçi Üniversitesi', city: 'İstanbul', country: 'Türkiye', isImportant: true, isActive: true },
    { id: 2, name: 'İstanbul Teknik Üniversitesi', city: 'İstanbul', country: 'Türkiye', isImportant: true, isActive: true },
    { id: 3, name: 'Orta Doğu Teknik Üniversitesi', city: 'Ankara', country: 'Türkiye', isImportant: true, isActive: true },
    { id: 4, name: 'Bilkent Üniversitesi', city: 'Ankara', country: 'Türkiye', isImportant: true, isActive: true },
    { id: 5, name: 'Koç Üniversitesi', city: 'İstanbul', country: 'Türkiye', isImportant: true, isActive: true }
  ];

  getUniversities(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için
    return of({
      items: this.mockUniversities,
      totalItems: this.mockUniversities.length
    });
  }

  getUniversity(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const university = this.mockUniversities.find(u => u.id === id);
    return of(university || {});
  }

  createUniversity(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: 6 });
  }

  updateUniversity(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteUniversity(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }
}