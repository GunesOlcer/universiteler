import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  DormitoryFeature,
  DormitoryFeatureCreateRequest,
  DormitoryFeatureUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DormitoryFeatureService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<DormitoryFeature[]> {
    return this.http.get<ApiResponse<DormitoryFeature[]>>(`${this.baseUrl}/api/DormitoryFeatures`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(feature => this.mapFeature(feature));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<DormitoryFeature | null> {
    return this.http.get<ApiResponse<DormitoryFeature>>(`${this.baseUrl}/api/DormitoryFeatures/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapFeature(response.data);
          }
          return null;
        }),
        catchError(this.handleError)
      );
  }

  create(request: DormitoryFeatureCreateRequest): Observable<DormitoryFeature> {
    return this.http.post<ApiResponse<DormitoryFeature>>(`${this.baseUrl}/api/DormitoryFeatures`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapFeature(response.data);
          }
          throw new Error(response.message || 'Failed to create feature');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: DormitoryFeatureUpdateRequest): Observable<DormitoryFeature> {
    return this.http.put<ApiResponse<DormitoryFeature>>(`${this.baseUrl}/api/DormitoryFeatures/${id}`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapFeature(response.data);
          }
          throw new Error(response.message || 'Failed to update feature');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/DormitoryFeatures/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  private mapFeature(feature: any): DormitoryFeature {
    return {
      ...feature,
      createdDate: new Date(feature.createdDate),
      updatedDate: feature.updatedDate ? new Date(feature.updatedDate) : undefined
    };
  }
}