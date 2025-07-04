// src/app/admin/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // Mock kullanıcılar için
  private mockUsers = [
    { 
      id: 1, 
      firstName: 'Ahmet', 
      lastName: 'Yılmaz', 
      email: 'ahmet.yilmaz@example.com', 
      isActive: true,
      lastLogin: new Date('2023-08-25T14:32:00')
    },
    { 
      id: 2, 
      firstName: 'Zeynep', 
      lastName: 'Kaya', 
      email: 'zeynep.kaya@example.com', 
      isActive: true,
      lastLogin: new Date('2023-08-24T09:15:00')
    },
    { 
      id: 3, 
      firstName: 'Mehmet', 
      lastName: 'Demir', 
      email: 'mehmet.demir@example.com', 
      isActive: true,
      lastLogin: new Date('2023-08-23T18:42:00')
    },
    { 
      id: 4, 
      firstName: 'Ayşe', 
      lastName: 'Uzun', 
      email: 'ayse.uzun@example.com', 
      isActive: false,
      lastLogin: new Date('2023-08-20T11:23:00')
    },
    { 
      id: 5, 
      firstName: 'Mustafa', 
      lastName: 'Çelik', 
      email: 'mustafa.celik@example.com', 
      isActive: true,
      lastLogin: new Date('2023-08-22T15:55:00')
    }
  ];

  // Mock online kullanıcılar için
  private mockOnlineUsers = [
    { 
      id: 1, 
      firstName: 'Ahmet', 
      lastName: 'Yılmaz', 
      email: 'ahmet.yilmaz@example.com',
      ipAddress: '192.168.1.1',
      currentUrl: '/universiteler/istanbul-teknik-universitesi'
    },
    { 
      id: 2, 
      firstName: 'Zeynep', 
      lastName: 'Kaya', 
      email: 'zeynep.kaya@example.com',
      ipAddress: '192.168.1.2',
      currentUrl: '/bolumler/bilgisayar-muhendisligi'
    },
    { 
      id: 3, 
      firstName: 'Mehmet', 
      lastName: 'Demir', 
      email: 'mehmet.demir@example.com',
      ipAddress: '192.168.1.3',
      currentUrl: '/yurtlar/istanbul'
    }
  ];

  getUsers(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredUsers = [...this.mockUsers];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.firstName.toLowerCase().includes(searchTerm) ||
          u.lastName.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
      }
    }
    
    // Sayfalama için
    const totalItems = filteredUsers.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredUsers.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredUsers = filteredUsers.slice(start, end);
    
    return of({
      items: filteredUsers,
      totalItems: totalItems
    });
  }

  getUser(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const user = this.mockUsers.find(u => u.id === id);
    return of(user || {});
  }

  createUser(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockUsers.length + 1 });
  }

  updateUser(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteUser(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  getOnlineUsers(): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/online`);
    
    // Mock veri için
    return of(this.mockOnlineUsers);
  }
}