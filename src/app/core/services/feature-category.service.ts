import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  FeatureCategory,
  FeatureCategoryCreateRequest,
  FeatureCategoryUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FeatureCategoryService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<FeatureCategory[]>> {
    return this.http.get<ApiResponse<FeatureCategory[]>>(`${this.baseUrl}/api/FeatureCategories`);
  }

  getById(id: number): Observable<ApiResponse<FeatureCategory>> {
    return this.http.get<ApiResponse<FeatureCategory>>(`${this.baseUrl}/api/FeatureCategories/${id}`);
  }

  create(request: FeatureCategoryCreateRequest): Observable<ApiResponse<FeatureCategory>> {
    return this.http.post<ApiResponse<FeatureCategory>>(`${this.baseUrl}/api/FeatureCategories`, request);
  }

  update(id: number, request: FeatureCategoryUpdateRequest): Observable<ApiResponse<FeatureCategory>> {
    return this.http.put<ApiResponse<FeatureCategory>>(`${this.baseUrl}/api/FeatureCategories/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/FeatureCategories/${id}`);
  }
}