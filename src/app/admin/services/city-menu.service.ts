// src/app/admin/services/city-menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityMenuService {
  private apiUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) { }

  // Mock menu structure
  private mockMenuStructure = [
    { id: 1, title: 'İklim', content: 'Şehrin iklim koşulları hakkında bilgiler.' },
    { id: 2, title: 'Demografik Yapı', content: 'Şehrin demografik yapısı hakkında bilgiler.' },
    { id: 3, title: 'Yaşantı', content: 'Şehirdeki günlük yaşam ve yaşam kalitesi hakkında bilgiler.' },
    { id: 4, title: 'Kültür ve Sanat', content: 'Şehrin kültürel ve sanatsal etkinlikleri hakkında bilgiler.' },
    { id: 5, title: 'Önemli Yerler', content: 'Şehirdeki turistik ve önemli yerler hakkında bilgiler.' },
    { id: 6, title: 'Yeme ve İçme', content: 'Şehrin yemek kültürü ve meşhur restoranları hakkında bilgiler.' },
    { id: 7, title: 'Ekonomi ve Çalışma', content: 'Şehrin ekonomik yapısı ve iş imkanları hakkında bilgiler.' },
    { id: 8, title: 'Sağlık ve Spor', content: 'Şehirdeki sağlık ve spor imkanları hakkında bilgiler.' },
    { id: 9, title: 'Ulaşım', content: 'Şehir içi ve şehirlerarası ulaşım imkanları hakkında bilgiler.' }
  ];

  getCityMenus(cityId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${cityId}/menus`);
    
    // Mock veri için
    return of(this.mockMenuStructure);
  }

  getMenuItem(cityId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${cityId}/menus/${menuItemId}`);
    
    // Mock veri için
    const menuItem = this.mockMenuStructure.find(item => item.id === menuItemId);
    return of(menuItem || {});
  }

  updateMenuItem(cityId: number, menuItemId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${cityId}/menus/${menuItemId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteMenuItem(cityId: number, menuItemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${cityId}/menus/${menuItemId}`);
    
    // Mock veri için
    return of({ success: true });
  }
}