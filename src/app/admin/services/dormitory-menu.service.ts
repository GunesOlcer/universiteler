// src/app/admin/services/dormitory-menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DormitoryMenuService {
  private apiUrl = `${environment.apiUrl}/dormitories`;

  constructor(private http: HttpClient) { }

  // Mock menu structure with nested items for Oda Tipleri
  private mockMenuStructure = [
    { id: 1, title: 'Oda ve Alanlar', content: 'Yurdun oda ve ortak alanları hakkında bilgiler.', parentId: null },
    { id: 2, title: 'Videolar', content: 'Yurt tanıtım videoları.', parentId: null },
    { id: 3, title: 'Oda Tipleri', content: 'Yurt oda tipleri hakkında genel bilgiler.', parentId: null },
    { id: 31, title: 'Tek Kişilik Oda', content: 'Tek kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 32, title: 'İki Kişilik Oda', content: 'İki kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 33, title: 'Üç Kişilik Oda', content: 'Üç kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 34, title: 'Dört Kişilik Oda', content: 'Dört kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 35, title: 'Beş Kişilik Oda', content: 'Beş kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 36, title: 'Altı Kişilik Oda', content: 'Altı kişilik odalar hakkında bilgiler.', parentId: 3 },
    { id: 37, title: 'Engelliye Özel Oda', content: 'Engelli öğrenciler için özel olarak tasarlanmış odalar hakkında bilgiler.', parentId: 3 },
    { id: 4, title: 'Yakın Üniversiteler', content: 'Yurdun yakınındaki üniversiteler hakkında bilgiler.', parentId: null },
    { id: 5, title: 'Konum ve Çevre', content: 'Yurdun konumu ve çevresindeki özellikler hakkında bilgiler.', parentId: null },
    { id: 6, title: 'Ulaşım', content: 'Yurda ulaşım imkanları hakkında bilgiler.', parentId: null }
  ];

  getDormitoryMenus(dormitoryId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${dormitoryId}/menus`);
    
    // Mock veri için - yalnızca ana menü öğelerini ve alt öğeleri ayrı şekilde döndürme
    const mainMenuItems = this.mockMenuStructure.filter(item => item.parentId === null);
    
    return of(mainMenuItems);
  }

  getSubMenuItems(dormitoryId: number, parentId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${dormitoryId}/menus/${parentId}/subitems`);
    
    // Mock veri için
    const subMenuItems = this.mockMenuStructure.filter(item => item.parentId === parentId);
    return of(subMenuItems);
  }

  getMenuItem(dormitoryId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${dormitoryId}/menus/${menuItemId}`);
    
    // Mock veri için
    const menuItem = this.mockMenuStructure.find(item => item.id === menuItemId);
    return of(menuItem || {});
  }

  updateMenuItem(dormitoryId: number, menuItemId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${dormitoryId}/menus/${menuItemId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteMenuItem(dormitoryId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${dormitoryId}/menus/${menuItemId}`);
    
    // Mock veri için
    return of({ success: true });
  }
}