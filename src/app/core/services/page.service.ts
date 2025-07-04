import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  Page,
  PageCreateRequest,
  PageUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PageService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<Page[]>> {
    return this.http.get<ApiResponse<Page[]>>(`${this.baseUrl}/api/Pages`);
  }

  getById(id: number): Observable<ApiResponse<Page>> {
    return this.http.get<ApiResponse<Page>>(`${this.baseUrl}/api/Pages/${id}`);
  }

  getBySlug(slug: string): Observable<ApiResponse<Page>> {
    return this.http.get<ApiResponse<Page>>(`${this.baseUrl}/api/Pages/slug/${slug}`);
  }

  create(request: PageCreateRequest): Observable<ApiResponse<Page>> {
    const formData = this.buildFormData(request);
    return this.http.post<ApiResponse<Page>>(`${this.baseUrl}/api/Pages`, formData);
  }

  update(id: number, request: PageUpdateRequest): Observable<ApiResponse<Page>> {
    const formData = this.buildFormData(request);
    return this.http.put<ApiResponse<Page>>(`${this.baseUrl}/api/Pages/${id}`, formData);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/Pages/${id}`);
  }
}