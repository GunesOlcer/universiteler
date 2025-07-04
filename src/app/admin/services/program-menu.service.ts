// src/app/admin/services/program-menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramMenuService {
  private apiUrl = `${environment.apiUrl}/program-menus`;

  constructor(private http: HttpClient) { }

  // Mock data
  private mockMenuItems = [
    { id: 1, programId: 1, title: 'Ayrıntılı Bilgi', content: 'Program hakkında detaylı bilgi buraya gelecek.' },
    { id: 2, programId: 1, title: 'Akademik Kadro', content: 'Programın akademik kadrosu buraya gelecek.' },
    { id: 3, programId: 1, title: 'Geçmiş Yıllar', content: 'Programın geçmiş yıllardaki durumu buraya gelecek.' },
    { id: 4, programId: 1, title: 'Özel Koşullar', content: 'Programa ait özel koşullar buraya gelecek.' },
    { id: 5, programId: 2, title: 'Ayrıntılı Bilgi', content: 'Program hakkında detaylı bilgi buraya gelecek.' },
    { id: 6, programId: 2, title: 'Akademik Kadro', content: 'Programın akademik kadrosu buraya gelecek.' }
  ];

  getProgramMenus(programId: number): Observable<any[]> {
    // In a real app, you would call an API
    // return this.http.get<any[]>(`${this.apiUrl}/${programId}`);
    
    // For mock data
    const menuItems = this.mockMenuItems.filter(item => item.programId === programId);
    return of(menuItems);
  }

  getMenuItem(programId: number, menuItemId: number): Observable<any> {
    // In a real app, you would call an API
    // return this.http.get<any>(`${this.apiUrl}/${programId}/${menuItemId}`);
    
    // For mock data
    const menuItem = this.mockMenuItems.find(item => item.programId === programId && item.id === menuItemId);
    return of(menuItem || {});
  }

  updateMenuItem(programId: number, menuItemId: number, data: any): Observable<any> {
    // In a real app, you would call an API
    // return this.http.put<any>(`${this.apiUrl}/${programId}/${menuItemId}`, data);
    
    // For mock data
    return of({ success: true });
  }

  deleteMenuItem(programId: number, menuItemId: number): Observable<any> {
    // In a real app, you would call an API
    // return this.http.delete<any>(`${this.apiUrl}/${programId}/${menuItemId}`);
    
    // For mock data
    return of({ success: true });
  }
}