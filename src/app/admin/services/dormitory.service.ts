// src/app/admin/services/dormitory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DormitoryService {
  private apiUrl = `${environment.apiUrl}/dormitories`;

  constructor(private http: HttpClient) { }

  // Mock veri için
  private mockDormitories = [
    { 
      id: 1, 
      name: 'Boğaziçi Üniversitesi Kız Yurdu', 
      slug: 'bogazici-universitesi-kiz-yurdu',
      cityId: 1,
      cityName: 'İstanbul',
      universityId: 1,
      universityName: 'Boğaziçi Üniversitesi',
      district: 'Beşiktaş',
      address: 'Bebek Mh. 34342 Beşiktaş/İstanbul',
      latitude: 41.087,
      longitude: 29.044,
      bedCount: 450,
      mealCount: 3,
      hasWifi: true,
      hasDailyCleaning: true,
      hasGym: true,
      isActive: true,
      isImportant: true,
      contactPerson: 'Ayşe Yılmaz',
      contactPhone: '0212 123 4567',
      contactMobile: '0532 123 4567',
      contactAddress: 'Bebek Mh. 34342 Beşiktaş/İstanbul',
      website: 'http://yurt.boun.edu.tr',
      whatsapp: '05321234567'
    },
    { 
      id: 2, 
      name: 'İTÜ Öğrenci Yurdu', 
      slug: 'itu-ogrenci-yurdu',
      cityId: 1,
      cityName: 'İstanbul',
      universityId: 2,
      universityName: 'İstanbul Teknik Üniversitesi',
      district: 'Maslak',
      address: 'Maslak Mh. 34467 Sarıyer/İstanbul',
      latitude: 41.104,
      longitude: 29.025,
      bedCount: 600,
      mealCount: 2,
      hasWifi: true,
      hasDailyCleaning: false,
      hasGym: true,
      isActive: true,
      isImportant: false,
      contactPerson: 'Mehmet Demir',
      contactPhone: '0212 456 7890',
      contactMobile: '0535 456 7890',
      contactAddress: 'Maslak Mh. 34467 Sarıyer/İstanbul',
      website: 'http://yurt.itu.edu.tr',
      whatsapp: '05354567890'
    },
    { 
      id: 3, 
      name: 'ODTÜ Erkek Yurdu', 
      slug: 'odtu-erkek-yurdu',
      cityId: 2,
      cityName: 'Ankara',
      universityId: 3,
      universityName: 'Orta Doğu Teknik Üniversitesi',
      district: 'Çankaya',
      address: 'Üniversiteler Mh. 06800 Çankaya/Ankara',
      latitude: 39.892,
      longitude: 32.784,
      bedCount: 750,
      mealCount: 3,
      hasWifi: true,
      hasDailyCleaning: true,
      hasGym: true,
      isActive: true,
      isImportant: true,
      contactPerson: 'Ali Yıldız',
      contactPhone: '0312 567 8901',
      contactMobile: '0538 567 8901',
      contactAddress: 'Üniversiteler Mh. 06800 Çankaya/Ankara',
      website: 'http://yurt.metu.edu.tr',
      whatsapp: '05385678901'
    },
    { 
      id: 4, 
      name: 'Bilkent Merkez Yurt', 
      slug: 'bilkent-merkez-yurt',
      cityId: 2,
      cityName: 'Ankara',
      universityId: 4,
      universityName: 'Bilkent Üniversitesi',
      district: 'Bilkent',
      address: 'Bilkent Üniversitesi Merkez Kampüs 06800 Bilkent/Ankara',
      latitude: 39.874,
      longitude: 32.747,
      bedCount: 500,
      mealCount: 3,
      hasWifi: true,
      hasDailyCleaning: true,
      hasGym: true,
      isActive: true,
      isImportant: false,
      contactPerson: 'Zeynep Kaya',
      contactPhone: '0312 678 9012',
      contactMobile: '0541 678 9012',
      contactAddress: 'Bilkent Üniversitesi Merkez Kampüs 06800 Bilkent/Ankara',
      website: 'http://yurt.bilkent.edu.tr',
      whatsapp: '05416789012'
    },
    { 
      id: 5, 
      name: 'Özel Üniversite Yurdu', 
      slug: 'ozel-universite-yurdu',
      cityId: 1,
      cityName: 'İstanbul',
      universityId: null,
      universityName: null,
      district: 'Kadıköy',
      address: 'Caferağa Mh. 34710 Kadıköy/İstanbul',
      latitude: 40.992,
      longitude: 29.026,
      bedCount: 300,
      mealCount: 2,
      hasWifi: true,
      hasDailyCleaning: false,
      hasGym: false,
      isActive: false,
      isImportant: false,
      contactPerson: 'Hakan Şahin',
      contactPhone: '0216 789 0123',
      contactMobile: '0544 789 0123',
      contactAddress: 'Caferağa Mh. 34710 Kadıköy/İstanbul',
      website: 'http://www.ozeluniversiteyurdu.com',
      whatsapp: '05447890123'
    }
  ];

  // Mock yurt özellikleri için
  private mockDormitoryFeatures = {
    buildingFeatures: ['Güvenlik Sistemi', 'Yangın Algılayıcı', 'Jeneratör', 'Asansör', 'Klima'],
    serviceFeatures: ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Günlük Temizlik', 'Ring Servisi'],
    roomTypes: ['Tek Kişilik Oda', 'İki Kişilik Oda', 'Üç Kişilik Oda'],
    roomFeatures: ['Ortopedik Yatak', 'Ses Yalıtımı', 'Çalışma Masası', 'Duş'],
    commonAreas: ['Çalışma Salonu', 'Kütüphane', 'Dinlenme Salonu', 'Spor Salonu', 'Mescit']
  };

  getDormitories(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(this.apiUrl, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredDormitories = [...this.mockDormitories];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.name) {
        filteredDormitories = filteredDormitories.filter(d => 
          d.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredDormitories = filteredDormitories.filter(d => d.isActive === isActive);
      }
      
      if (params.city) {
        filteredDormitories = filteredDormitories.filter(d => 
          d.cityId === parseInt(params.city)
        );
      }
    }
    
    // Sayfalama için
    const totalItems = filteredDormitories.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredDormitories.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredDormitories = filteredDormitories.slice(start, end);
    
    return of({
      items: filteredDormitories,
      totalItems: totalItems
    });
  }

  getDormitory(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    const dormitory = this.mockDormitories.find(d => d.id === id);
    return of({
      ...dormitory,
      features: this.mockDormitoryFeatures
    });
  }

  createDormitory(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(this.apiUrl, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockDormitories.length + 1 });
  }

  updateDormitory(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteDormitory(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Dormitory features methods
  getFeatureCategories(): Observable<any> {
    // Mock veri için
    return of([
      { id: 1, name: 'Bina Özellikleri' },
      { id: 2, name: 'Yemek ve Temizlik Hizmetleri' },
      { id: 3, name: 'Diğer Hizmetler' },
      { id: 4, name: 'Özel Alan ve Olanaklar' },
      { id: 5, name: 'Sosyal Etkinlikler' },
      { id: 6, name: 'Oda Tipleri' },
      { id: 7, name: 'Oda Özellikleri' },
      { id: 8, name: 'Ortak Alanlar' },
      { id: 9, name: 'Spor Alanları' },
      { id: 10, name: 'Konum ve Mekan' },
      { id: 11, name: 'Çevresel Olanaklar' },
      { id: 12, name: 'Toplu Taşıma' },
      { id: 13, name: 'Ulaşım (10 km\'den kısa mesafede)' }
    ]);
  }

  getFeatures(categoryId?: number): Observable<any> {
    // Mock veri için
    const allFeatures = [
      { id: 1, categoryId: 1, name: 'Güvenlik Sistemi' },
      { id: 2, categoryId: 1, name: 'Yangın Algılayıcı' },
      { id: 3, categoryId: 1, name: 'Jeneratör' },
      { id: 4, categoryId: 1, name: 'Çelik Kapı' },
      { id: 5, categoryId: 1, name: 'Asansör' },
      { id: 6, categoryId: 1, name: 'Klima' },
      { id: 7, categoryId: 1, name: 'Merkezi Isıtma' },
      { id: 8, categoryId: 2, name: 'Kahvaltı' },
      { id: 9, categoryId: 2, name: 'Açık Büfe Kahvaltı' },
      { id: 10, categoryId: 2, name: 'Kahvaltı (ücretli)' },
      { id: 11, categoryId: 2, name: 'Öğle Yemeği' },
      { id: 12, categoryId: 2, name: 'Akşam Yemeği' },
      { id: 13, categoryId: 2, name: 'Günlük Temizlik' },
      { id: 14, categoryId: 3, name: '7/24 Güvenlik' },
      { id: 15, categoryId: 3, name: 'Kartlı Giriş/Çıkış' },
      { id: 16, categoryId: 3, name: 'Ring Servisi' },
      { id: 17, categoryId: 6, name: 'Tek Kişilik Oda' },
      { id: 18, categoryId: 6, name: 'İki Kişilik Oda' },
      { id: 19, categoryId: 6, name: 'Üç Kişilik Oda' },
      { id: 20, categoryId: 7, name: 'Ortopedik Yatak' },
      { id: 21, categoryId: 7, name: 'Çalışma Masası' },
      { id: 22, categoryId: 7, name: 'Kişisel Dolap' },
      { id: 23, categoryId: 8, name: 'Çalışma Salonu' },
      { id: 24, categoryId: 8, name: 'Kütüphane' },
      { id: 25, categoryId: 8, name: 'Dinlenme Salonu' },
      { id: 26, categoryId: 9, name: 'Spor Salonu' },
      { id: 27, categoryId: 9, name: 'Fitness Salonu' },
      { id: 28, categoryId: 9, name: 'Masa Tenisi' }
    ];

    if (categoryId) {
      return of(allFeatures.filter(f => f.categoryId === categoryId));
    }
    return of(allFeatures);
  }

  createFeatureCategory(data: any): Observable<any> {
    return of({ success: true, id: 14 });
  }

  updateFeatureCategory(id: number, data: any): Observable<any> {
    return of({ success: true });
  }

  deleteFeatureCategory(id: number): Observable<any> {
    return of({ success: true });
  }

  createFeature(data: any): Observable<any> {
    return of({ success: true, id: 29 });
  }

  updateFeature(id: number, data: any): Observable<any> {
    return of({ success: true });
  }

  deleteFeature(id: number): Observable<any> {
    return of({ success: true });
  }
}