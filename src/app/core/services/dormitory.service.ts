import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Dormitory,
  DormitoryCreateRequest,
  DormitoryUpdateRequest,
  DormitoryType,
  GenderType,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DormitoryService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<Dormitory[]> {
    return this.http.get<ApiResponse<Dormitory[]>>(`${this.baseUrl}/api/Dormitories`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(dormitory => this.mapDormitory(dormitory));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Dormitory | null> {
    return this.http.get<ApiResponse<Dormitory>>(`${this.baseUrl}/api/Dormitories/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDormitory(response.data);
          }
          return null;
        }),
        catchError(this.handleError)
      );
  }

  getFeatured(count: number = 8, type?: DormitoryType, gender?: GenderType): Observable<Dormitory[]> {
    const params = this.buildHttpParams({ count, type, gender });
    return this.http.get<ApiResponse<Dormitory[]>>(`${this.baseUrl}/api/Dormitories/featured`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(dormitory => this.mapDormitory(dormitory));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  create(request: DormitoryCreateRequest): Observable<Dormitory> {
    const formData = this.buildFormData(request);
    return this.http.post<ApiResponse<Dormitory>>(`${this.baseUrl}/api/Dormitories`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDormitory(response.data);
          }
          throw new Error(response.message || 'Failed to create dormitory');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: DormitoryUpdateRequest): Observable<Dormitory> {
    const formData = this.buildFormData(request);
    return this.http.put<ApiResponse<Dormitory>>(`${this.baseUrl}/api/Dormitories/${id}`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDormitory(response.data);
          }
          throw new Error(response.message || 'Failed to update dormitory');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/Dormitories/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  private mapDormitory(dormitory: any): Dormitory {
    return {
      ...dormitory,
      createdDate: new Date(dormitory.createdDate),
      updatedDate: dormitory.updatedDate ? new Date(dormitory.updatedDate) : undefined,
      features: dormitory.features?.map((feature: any) => ({
        ...feature,
        createdDate: new Date(feature.createdDate),
        updatedDate: feature.updatedDate ? new Date(feature.updatedDate) : undefined
      })) || []
    };
  }
}