import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  University,
  UniversityCreateRequest,
  UniversityUpdateRequest,
  UniversityFilterRequest,
  UniversityType,
  ApiResponse,
  PaginatedResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UniversityService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<University[]> {
    return this.http.get<ApiResponse<University[]>>(`${this.baseUrl}/api/Universities`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(university => this.mapUniversity(university));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<ApiResponse<University>> {
    return this.http.get<ApiResponse<University>>(`${this.baseUrl}/api/Universities/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return {
              ...response,
              data: this.mapUniversity(response.data)
            };
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getByCityId(cityId: number): Observable<University[]> {
    return this.http.get<ApiResponse<University[]>>(`${this.baseUrl}/api/Universities/city/${cityId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(university => this.mapUniversity(university));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getFeatured(count: number = 8, type?: UniversityType): Observable<University[]> {
    const params = this.buildHttpParams({ count, type });
    return this.http.get<ApiResponse<University[]>>(`${this.baseUrl}/api/Universities/featured`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(university => this.mapUniversity(university));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getTopUniversities(count: number = 8): Observable<University[]> {
    return this.getFeatured(count);
  }

  filter(request: UniversityFilterRequest): Observable<ApiResponse<PaginatedResult<University>>> {
    return this.http.post<ApiResponse<PaginatedResult<University>>>(`${this.baseUrl}/api/Universities/filter`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return {
              ...response,
              data: {
                ...response.data,
                data: response.data.data.map(university => this.mapUniversity(university))
              }
            };
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  create(request: UniversityCreateRequest): Observable<University> {
    const formData = this.buildFormData(request);
    return this.http.post<ApiResponse<University>>(`${this.baseUrl}/api/Universities`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapUniversity(response.data);
          }
          throw new Error(response.message || 'Failed to create university');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: UniversityUpdateRequest): Observable<University> {
    const formData = this.buildFormData(request);
    return this.http.put<ApiResponse<University>>(`${this.baseUrl}/api/Universities/${id}`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapUniversity(response.data);
          }
          throw new Error(response.message || 'Failed to update university');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/Universities/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  private mapUniversity(university: any): University {
    return {
      ...university,
      createdDate: new Date(university.createdDate),
      updatedDate: university.updatedDate ? new Date(university.updatedDate) : undefined,
      country: university.countryName === 'KKTC' ? 'KKTC' : university.countryName
    };
  }
}