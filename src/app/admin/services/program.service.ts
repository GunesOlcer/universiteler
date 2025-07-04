// src/app/admin/services/program.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private apiUrl = `${environment.apiUrl}/programs`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockPrograms = [
    { 
      id: 1, 
      name: 'Bilgisayar Mühendisliği', 
      facultyId: 1, 
      facultyName: 'Mühendislik Fakültesi',
      language: 'Türkçe',
      fee: 45000,
      educationType: 'Örgün',
      scoreType: 'SAY',
      duration: 4,
      isActive: true,
      quotaList: [
        { year: 2023, quota: 120, filled: 120, minScore: 450.25, maxScore: 520.18, minRank: 12500, maxRank: 25000 },
        { year: 2022, quota: 110, filled: 110, minScore: 445.18, maxScore: 515.22, minRank: 13200, maxRank: 27000 },
        { year: 2021, quota: 100, filled: 100, minScore: 440.35, maxScore: 510.45, minRank: 14000, maxRank: 30000 }
      ]
    },
    { 
      id: 2, 
      name: 'Elektrik-Elektronik Mühendisliği', 
      facultyId: 1, 
      facultyName: 'Mühendislik Fakültesi',
      language: 'İngilizce',
      fee: 50000,
      educationType: 'Örgün',
      scoreType: 'SAY',
      duration: 4,
      isActive: true,
      quotaList: [
        { year: 2023, quota: 100, filled: 100, minScore: 455.75, maxScore: 525.90, minRank: 10500, maxRank: 22000 },
        { year: 2022, quota: 95, filled: 95, minScore: 452.20, maxScore: 520.50, minRank: 11200, maxRank: 24000 },
        { year: 2021, quota: 90, filled: 90, minScore: 448.80, maxScore: 515.20, minRank: 12500, maxRank: 26500 }
      ]
    },
    { 
      id: 3, 
      name: 'Makine Mühendisliği', 
      facultyId: 1, 
      facultyName: 'Mühendislik Fakültesi',
      language: 'Türkçe',
      fee: 42000,
      educationType: 'Örgün',
      scoreType: 'SAY',
      duration: 4,
      isActive: true,
      quotaList: [
        { year: 2023, quota: 110, filled: 110, minScore: 440.25, maxScore: 510.50, minRank: 15000, maxRank: 32000 },
        { year: 2022, quota: 105, filled: 105, minScore: 435.40, maxScore: 505.30, minRank: 16500, maxRank: 34500 },
        { year: 2021, quota: 100, filled: 100, minScore: 430.60, maxScore: 500.20, minRank: 18000, maxRank: 37000 }
      ]
    },
    { 
      id: 4, 
      name: 'İşletme', 
      facultyId: 2, 
      facultyName: 'İktisadi ve İdari Bilimler Fakültesi',
      language: 'Türkçe',
      fee: 35000,
      educationType: 'Örgün',
      scoreType: 'EA',
      duration: 4,
      isActive: true,
      quotaList: [
        { year: 2023, quota: 150, filled: 150, minScore: 390.75, maxScore: 450.80, minRank: 35000, maxRank: 75000 },
        { year: 2022, quota: 140, filled: 140, minScore: 385.25, maxScore: 445.30, minRank: 38000, maxRank: 80000 },
        { year: 2021, quota: 130, filled: 130, minScore: 380.40, maxScore: 440.20, minRank: 40000, maxRank: 85000 }
      ]
    },
    { 
      id: 5, 
      name: 'İngilizce Öğretmenliği', 
      facultyId: 4, 
      facultyName: 'Yabancı Diller Yüksekokulu',
      language: 'İngilizce',
      fee: 38000,
      educationType: 'Örgün',
      scoreType: 'DİL',
      duration: 4,
      isActive: true,
      quotaList: [
        { year: 2023, quota: 80, filled: 80, minScore: 420.50, maxScore: 480.30, minRank: 15000, maxRank: 35000 },
        { year: 2022, quota: 75, filled: 75, minScore: 415.30, maxScore: 475.20, minRank: 16500, maxRank: 38000 },
        { year: 2021, quota: 70, filled: 70, minScore: 410.60, maxScore: 470.40, minRank: 18000, maxRank: 40000 }
      ]
    },
    { 
      id: 6, 
      name: 'Kimya Mühendisliği', 
      facultyId: 1, 
      facultyName: 'Mühendislik Fakültesi',
      language: 'İngilizce',
      fee: 48000,
      educationType: 'Örgün',
      scoreType: 'SAY',
      duration: 4, 
      isActive: false,
      quotaList: [
        { year: 2023, quota: 90, filled: 90, minScore: 430.25, maxScore: 500.50, minRank: 20000, maxRank: 40000 },
        { year: 2022, quota: 85, filled: 85, minScore: 425.40, maxScore: 495.30, minRank: 22000, maxRank: 43000 },
        { year: 2021, quota: 80, filled: 80, minScore: 420.60, maxScore: 490.20, minRank: 24000, maxRank: 46000 }
      ]
    }
  ];

  getPrograms(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredPrograms = [...this.mockPrograms];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.name) {
        filteredPrograms = filteredPrograms.filter(p => 
          p.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.facultyId) {
        filteredPrograms = filteredPrograms.filter(p => 
          p.facultyId === parseInt(params.facultyId)
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredPrograms = filteredPrograms.filter(p => p.isActive === isActive);
      }
      
      if (params.language) {
        filteredPrograms = filteredPrograms.filter(p => 
          p.language.toLowerCase() === params.language.toLowerCase()
        );
      }
    }
    
    // Sayfalama için
    const totalItems = filteredPrograms.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredPrograms.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredPrograms = filteredPrograms.slice(start, end);
    
    return of({
      items: filteredPrograms,
      totalItems: totalItems
    });
  }

  getProgram(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const program = this.mockPrograms.find(p => p.id === id);
    return of(program || {});
  }

  createProgram(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockPrograms.length + 1 });
  }

  updateProgram(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteProgram(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  getQuotaData(programId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${programId}/quotas`);
    
    // Mock veri için
    const program = this.mockPrograms.find(p => p.id === programId);
    return of(program ? program.quotaList : []);
  }
}