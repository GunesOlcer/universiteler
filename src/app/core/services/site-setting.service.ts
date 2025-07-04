import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  SiteSetting,
  SiteSettingCreateRequest,
  SiteSettingUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<SiteSetting[]>> {
    return this.http.get<ApiResponse<SiteSetting[]>>(`${this.baseUrl}/api/SiteSettings`);
  }

  getByKey(key: string): Observable<ApiResponse<SiteSetting>> {
    return this.http.get<ApiResponse<SiteSetting>>(`${this.baseUrl}/api/SiteSettings/${key}`);
  }

  create(request: SiteSettingCreateRequest): Observable<ApiResponse<SiteSetting>> {
    return this.http.post<ApiResponse<SiteSetting>>(`${this.baseUrl}/api/SiteSettings`, request);
  }

  update(id: number, request: SiteSettingUpdateRequest): Observable<ApiResponse<SiteSetting>> {
    return this.http.put<ApiResponse<SiteSetting>>(`${this.baseUrl}/api/SiteSettings/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/SiteSettings/${id}`);
  }
}