// src/app/admin/services/department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockDepartments = [
    { 
      id: 1, 
      name: 'Bilgisayar Mühendisliği', 
      slug: 'bilgisayar-muhendisligi', 
      shortDescription: 'Yazılım ve donanım sistemleri geliştirme',
      description: 'Bilgisayar mühendisliği, bilgisayar sistemleri ve bu sistemlerin tasarlanması, geliştirilmesi ve uygulanması ile ilgilenen bir mühendislik dalıdır.',
      trainingPeriod: 4,
      examType: 'sayısal',
      programCount: 25,
      isActive: true,
      isImportant: true
    },
    { 
      id: 2, 
      name: 'Makine Mühendisliği', 
      slug: 'makine-muhendisligi', 
      shortDescription: 'Makine ve mekanik sistemler tasarımı',
      description: 'Makine mühendisliği, makinelerin, araçların ve sistemlerin tasarımı, üretimi, işletilmesi ve bakımı ile ilgilenen bir mühendislik disiplinidir.',
      trainingPeriod: 4,
      examType: 'sayısal',
      programCount: 30,
      isActive: true,
      isImportant: true
    },
    { 
      id: 3, 
      name: 'Elektrik-Elektronik Mühendisliği', 
      slug: 'elektrik-elektronik-muhendisligi', 
      shortDescription: 'Elektrik ve elektronik sistem tasarımı',
      description: 'Elektrik-elektronik mühendisliği, elektrik enerjisi, elektronik devreler ve sistemlerin tasarımı, geliştirilmesi ve uygulanması ile ilgilenen bir mühendislik dalıdır.',
      trainingPeriod: 4,
      examType: 'sayısal',
      programCount: 28,
      isActive: true,
      isImportant: true
    },
    { 
      id: 4, 
      name: 'İnşaat Mühendisliği', 
      slug: 'insaat-muhendisligi', 
      shortDescription: 'Yapıların tasarımı ve inşası',
      description: 'İnşaat mühendisliği, yapıların, altyapıların ve ulaşım sistemlerinin tasarımı, inşası ve bakımı ile ilgilenen bir mühendislik dalıdır.',
      trainingPeriod: 4,
      examType: 'sayısal',
      programCount: 22,
      isActive: true,
      isImportant: false
    },
    { 
      id: 5, 
      name: 'Endüstri Mühendisliği', 
      slug: 'endustri-muhendisligi', 
      shortDescription: 'Üretim ve hizmet sistemleri optimizasyonu',
      description: 'Endüstri mühendisliği, üretim ve hizmet sistemlerinin tasarımı, geliştirilmesi ve optimizasyonu ile ilgilenen bir mühendislik dalıdır.',
      trainingPeriod: 4,
      examType: 'sayısal',
      programCount: 20,
      isActive: true,
      isImportant: false
    }
  ];

  getDepartments(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredDepartments = [...this.mockDepartments];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.name) {
        filteredDepartments = filteredDepartments.filter(d => 
          d.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredDepartments = filteredDepartments.filter(d => d.isActive === isActive);
      }
    }
    
    // Sayfalama için
    const totalItems = filteredDepartments.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredDepartments.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredDepartments = filteredDepartments.slice(start, end);
    
    return of({
      items: filteredDepartments,
      totalItems: totalItems
    });
  }

  getDepartment(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const department = this.mockDepartments.find(d => d.id === id);
    return of(department || {});
  }

  createDepartment(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockDepartments.length + 1 });
  }

  updateDepartment(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteDepartment(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }
}