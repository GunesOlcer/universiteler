// university-menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityMenuService {
  private apiUrl = `${environment.apiUrl}/universities`;

  constructor(private http: HttpClient) { }

  // Mock menu structure
  private mockMenuStructure = [
    {
      id: 1,
      title: '1. Üniversite',
      children: [
        { id: 101, title: '1.A. Kilit Özellikler', content: 'Kilit özellikler içeriği burada yer alacak.' },
        { id: 102, title: '1.B. Kampüsler', content: 'Kampüsler içeriği burada yer alacak.' },
        { id: 103, title: '1.C. Burslar', content: 'Burslar içeriği burada yer alacak.' },
        { id: 104, title: '1.D. Barınma', content: 'Barınma içeriği burada yer alacak.' },
        { id: 105, title: '1.E. İş ve Staj', content: 'İş ve Staj içeriği burada yer alacak.' },
        { id: 106, title: '1.F. Erasmus', content: 'Erasmus içeriği burada yer alacak.' },
        { id: 107, title: '1.G. Sık Sorulanlar', content: 'Sık Sorulanlar içeriği burada yer alacak.' }
      ]
    },
    {
      id: 2,
      title: '2. Eğitim',
      children: [
        { id: 201, title: '2.A. Eğitim Sistemi', content: 'Eğitim Sistemi içeriği burada yer alacak.' },
        { id: 202, title: '2.B. Bölüm ve Puanlar', content: 'Bölüm ve Puanlar içeriği burada yer alacak.' },
        { id: 203, title: '2.C. Hazırlık Eğitimi', content: 'Hazırlık Eğitimi içeriği burada yer alacak.' },
        { id: 204, title: '2.D. Çift Ana Dal - Yan Dal', content: 'Çift Ana Dal - Yan Dal içeriği burada yer alacak.' },
        { id: 205, title: '2.E. Uzaktan Eğitim', content: 'Uzaktan Eğitim içeriği burada yer alacak.' },
        { id: 206, title: '2.F. Akreditasyon', content: 'Akreditasyon içeriği burada yer alacak.' }
      ]
    },
    {
      id: 3,
      title: '3. Kampüs',
      children: [
        { id: 301, title: '3.A. Ulaşım', content: 'Ulaşım içeriği burada yer alacak.' },
        { id: 302, title: '3.B. Yaşam', content: 'Yaşam içeriği burada yer alacak.' },
        { id: 303, title: '3.C. Topluluklar', content: 'Topluluklar içeriği burada yer alacak.' },
        { id: 304, title: '3.D. Kütüphane', content: 'Kütüphane içeriği burada yer alacak.' },
        { id: 305, title: '3.E. Sağlık Olanakları', content: 'Sağlık Olanakları içeriği burada yer alacak.' },
        { id: 306, title: '3.F. Spor Olanakları', content: 'Spor Olanakları içeriği burada yer alacak.' },
        { id: 307, title: '3.G. Yeme-İçme', content: 'Yeme-İçme içeriği burada yer alacak.' },
        { id: 308, title: '3.H. Diğer Olanaklar', content: 'Diğer Olanaklar içeriği burada yer alacak.' }
      ]
    },
    {
      id: 5,
      title: '5. Uluslararası',
      children: []
    }
  ];

  getUniversityMenus(universityId: number): Observable<any> {
    // In a real app, make API call to get university menus
    // return this.http.get<any>(`${this.apiUrl}/${universityId}/menus`);
    
    // For mock data, return the hardcoded structure
    return of(this.mockMenuStructure);
  }

  getMenuItem(universityId: number, menuItemId: number): Observable<any> {
    // In a real app, make API call to get specific menu item
    // return this.http.get<any>(`${this.apiUrl}/${universityId}/menus/${menuItemId}`);
    
    // For mock data, find the menu item in the structure
    let foundMenuItem = null;
    for (const category of this.mockMenuStructure) {
      const item = category.children.find(child => child.id === menuItemId);
      if (item) {
        foundMenuItem = item;
        break;
      }
    }
    
    return of(foundMenuItem || {});
  }

  updateMenuItem(universityId: number, menuItemId: number, data: any): Observable<any> {
    // In a real app, make API call to update menu item
    // return this.http.put<any>(`${this.apiUrl}/${universityId}/menus/${menuItemId}`, data);
    
    // For mock data, just return success
    return of({ success: true });
  }

  deleteMenuItem(universityId: number, menuItemId: number): Observable<any> {
    // In a real app, make API call to delete menu item
    // return this.http.delete<any>(`${this.apiUrl}/${universityId}/menus/${menuItemId}`);
    
    // For mock data, just return success
    return of({ success: true });
  }
}