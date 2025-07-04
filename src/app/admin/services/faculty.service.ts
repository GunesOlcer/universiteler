// src/app/admin/services/faculty.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/faculties`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockFaculties = [
    { 
      id: 1, 
      name: 'Mühendislik Fakültesi', 
      type: 'faculty', 
      universityId: 1, 
      universityName: 'Boğaziçi Üniversitesi',
      isActive: true 
    },
    { 
      id: 2, 
      name: 'İktisadi ve İdari Bilimler Fakültesi', 
      type: 'faculty', 
      universityId: 1, 
      universityName: 'Boğaziçi Üniversitesi',
      isActive: true 
    },
    { 
      id: 3, 
      name: 'Fen Edebiyat Fakültesi', 
      type: 'faculty', 
      universityId: 2, 
      universityName: 'İstanbul Teknik Üniversitesi',
      isActive: true 
    },
    { 
      id: 4, 
      name: 'Yabancı Diller Yüksekokulu', 
      type: 'school', 
      universityId: 3, 
      universityName: 'Orta Doğu Teknik Üniversitesi',
      isActive: true 
    },
    { 
      id: 5, 
      name: 'Sosyal Bilimler Enstitüsü', 
      type: 'institute', 
      universityId: 4, 
      universityName: 'Bilkent Üniversitesi',
      isActive: false 
    }
  ];

  getFaculties(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredFaculties = [...this.mockFaculties];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.name) {
        filteredFaculties = filteredFaculties.filter(f => 
          f.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredFaculties = filteredFaculties.filter(f => f.isActive === isActive);
      }
      
      if (params.type) {
        filteredFaculties = filteredFaculties.filter(f => f.type === params.type);
      }
      
      if (params.universityId) {
        filteredFaculties = filteredFaculties.filter(f => 
          f.universityId === parseInt(params.universityId)
        );
      }
    }
    
    // Sayfalama için
    const totalItems = filteredFaculties.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredFaculties.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredFaculties = filteredFaculties.slice(start, end);
    
    return of({
      items: filteredFaculties,
      totalItems: totalItems
    });
  }

  getFaculty(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const faculty = this.mockFaculties.find(f => f.id === id);
    return of(faculty || {});
  }

  createFaculty(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockFaculties.length + 1 });
  }

  updateFaculty(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteFaculty(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }
}