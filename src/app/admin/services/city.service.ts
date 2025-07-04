// src/app/admin/services/city.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockCities = [
    { id: 1, name: 'İstanbul', country: 'Türkiye' },
    { id: 2, name: 'Ankara', country: 'Türkiye' },
    { id: 3, name: 'İzmir', country: 'Türkiye' },
    { id: 4, name: 'Bursa', country: 'Türkiye' },
    { id: 5, name: 'Antalya', country: 'Türkiye' },
    { id: 6, name: 'Lefkoşa', country: 'KKTC' }
  ];

  getCities(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için
    return of(this.mockCities);
  }

  getCity(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const city = this.mockCities.find(c => c.id === id);
    return of(city || {});
  }

  createCity(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: 7 });
  }

  updateCity(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteCity(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }
}