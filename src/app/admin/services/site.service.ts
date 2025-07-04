// src/app/admin/services/site.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = `${environment.apiUrl}/site`;

  constructor(private http: HttpClient) { }

  // Mock yöneticiler için
  private mockAdmins = [
    { 
      id: 1, 
      fullName: 'Admin User', 
      email: 'admin@example.com', 
      username: 'admin',
      isActive: true,
      lastLogin: new Date('2023-08-25T14:32:00'),
      permissions: ['full_admin']
    },
    { 
      id: 2, 
      fullName: 'Content Manager', 
      email: 'content@example.com', 
      username: 'content_manager',
      isActive: true,
      lastLogin: new Date('2023-08-24T09:15:00'),
      permissions: ['content_management']
    },
    { 
      id: 3, 
      fullName: 'User Manager', 
      email: 'users@example.com', 
      username: 'user_manager',
      isActive: true,
      lastLogin: new Date('2023-08-23T18:42:00'),
      permissions: ['user_management']
    },
    { 
      id: 4, 
      fullName: 'Statistics Manager', 
      email: 'stats@example.com', 
      username: 'stats_manager',
      isActive: false,
      lastLogin: new Date('2023-08-20T11:23:00'),
      permissions: ['statistics']
    },
    { 
      id: 5, 
      fullName: 'Site Manager', 
      email: 'site@example.com', 
      username: 'site_manager',
      isActive: true,
      lastLogin: new Date('2023-08-22T15:55:00'),
      permissions: ['site_management']
    }
  ];

  // Mock site ayarları için
  private mockSiteSettings = {
    siteStatus: 'open', // open, closed
    allowedIps: [
      '192.168.1.1',
      '127.0.0.1'
    ]
  };

  getAdmins(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/admins`, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredAdmins = [...this.mockAdmins];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredAdmins = filteredAdmins.filter(a => 
          a.fullName.toLowerCase().includes(searchTerm) ||
          a.username.toLowerCase().includes(searchTerm) ||
          a.email.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredAdmins = filteredAdmins.filter(a => a.isActive === isActive);
      }
      
      if (params.permission) {
        filteredAdmins = filteredAdmins.filter(a => 
          a.permissions.includes(params.permission)
        );
      }
    }
    
    // Sayfalama için
    const totalItems = filteredAdmins.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredAdmins.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredAdmins = filteredAdmins.slice(start, end);
    
    return of({
      items: filteredAdmins,
      totalItems: totalItems
    });
  }

  getAdmin(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/admins/${id}`);
    
    // Mock veri için
    const admin = this.mockAdmins.find(a => a.id === id);
    return of(admin || {});
  }

  createAdmin(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/admins`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockAdmins.length + 1 });
  }

  updateAdmin(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/admins/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteAdmin(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/admins/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  getSiteSettings(): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/settings`);
    
    // Mock veri için
    return of(this.mockSiteSettings);
  }

  updateSiteSettings(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/settings`, data);
    
    // Mock veri için
    this.mockSiteSettings = { ...this.mockSiteSettings, ...data };
    return of({ success: true });
  }

  addAllowedIp(ip: string): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/settings/allowed-ips`, { ip });
    
    // Mock veri için
    this.mockSiteSettings.allowedIps.push(ip);
    return of({ success: true });
  }

  removeAllowedIp(ip: string): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/settings/allowed-ips/${encodeURIComponent(ip)}`);
    
    // Mock veri için
    this.mockSiteSettings.allowedIps = this.mockSiteSettings.allowedIps.filter(i => i !== ip);
    return of({ success: true });
  }
}