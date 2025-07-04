import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  Faculty,
  FacultyCreateRequest,
  FacultyUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class FacultyService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<Faculty[]>> {
    return this.http.get<ApiResponse<Faculty[]>>(`${this.baseUrl}/api/Faculties`);
  }

  getById(id: number): Observable<ApiResponse<Faculty>> {
    return this.http.get<ApiResponse<Faculty>>(`${this.baseUrl}/api/Faculties/${id}`);
  }

  create(request: FacultyCreateRequest): Observable<ApiResponse<Faculty>> {
    return this.http.post<ApiResponse<Faculty>>(`${this.baseUrl}/api/Faculties`, request);
  }

  update(id: number, request: FacultyUpdateRequest): Observable<ApiResponse<Faculty>> {
    return this.http.put<ApiResponse<Faculty>>(`${this.baseUrl}/api/Faculties/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/Faculties/${id}`);
  }
}