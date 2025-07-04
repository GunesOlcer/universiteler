import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  News,
  NewsCreateRequest,
  NewsUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<News[]>> {
    return this.http.get<ApiResponse<News[]>>(`${this.baseUrl}/api/News`);
  }

  getById(id: number): Observable<ApiResponse<News>> {
    return this.http.get<ApiResponse<News>>(`${this.baseUrl}/api/News/${id}`);
  }

  getLatest(count: number = 6): Observable<ApiResponse<News[]>> {
    const params = this.buildHttpParams({ count });
    return this.http.get<ApiResponse<News[]>>(`${this.baseUrl}/api/News/latest`, { params });
  }

  create(request: NewsCreateRequest): Observable<ApiResponse<News>> {
    const formData = this.buildFormData(request);
    return this.http.post<ApiResponse<News>>(`${this.baseUrl}/api/News`, formData);
  }

  update(id: number, request: NewsUpdateRequest): Observable<ApiResponse<News>> {
    const formData = this.buildFormData(request);
    return this.http.put<ApiResponse<News>>(`${this.baseUrl}/api/News/${id}`, formData);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/News/${id}`);
  }
}