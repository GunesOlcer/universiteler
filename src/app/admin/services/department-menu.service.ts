// src/app/admin/services/department-menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMenuService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) { }

  // Mock menu structure
  private mockMenuStructure = [
    { id: 1, title: 'İçerik ve Müfredat', content: 'Bu bölümün içerik ve müfredatı hakkında bilgiler.' },
    { id: 2, title: 'Kim için uygun?', content: 'Bu bölümün hangi öğrenciler için uygun olduğu bilgisi.' },
    { id: 3, title: 'Kim için uygun değil?', content: 'Bu bölümün hangi öğrenciler için uygun olmadığı bilgisi.' },
    { id: 4, title: 'Gerekli Beceriler', content: 'Bu bölüm için gerekli beceriler listesi.' },
    { id: 5, title: 'Tavsiyeler', content: 'Bölüm öğrencileri için tavsiyeler.' },
    { id: 6, title: 'Çalışma Hayatı', content: 'Mezunların çalışma hayatındaki deneyimleri.' },
    { id: 7, title: 'Bölüm Özeti', content: 'Bölümün genel bir özeti.' },
    { id: 8, title: 'Gelecek Vizyonu', content: 'Bölümün gelecekteki vizyonu ve hedefleri.' }
  ];

  getDepartmentMenus(departmentId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${departmentId}/menus`);
    
    // Mock veri için
    return of(this.mockMenuStructure);
  }

  getMenuItem(departmentId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${departmentId}/menus/${menuItemId}`);
    
    // Mock veri için
    const menuItem = this.mockMenuStructure.find(item => item.id === menuItemId);
    return of(menuItem || {});
  }

  updateMenuItem(departmentId: number, menuItemId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${departmentId}/menus/${menuItemId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteMenuItem(departmentId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${departmentId}/menus/${menuItemId}`);
    
    // Mock veri için
    return of({ success: true });
  }
}