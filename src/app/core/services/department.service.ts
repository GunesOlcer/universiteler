// src/app/core/services/department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
  DepartmentMenu,
  DepartmentMenuCreateRequest,
  DepartmentMenuUpdateRequest
} from '../models/department.model';
import { 
  ApiResponse, 
  ListResponse,
  BaseResponse,
  PagedResponse,
  PaginationParams
} from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  // Department CRUD Operations
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<{success: boolean, message: string, data: Department[]}>(`${this.baseUrl}/api/Departments`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(dept => this.mapDepartmentResponse(dept));
          }
          throw new Error(response.message || 'Bölümler yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<{success: boolean, message: string, data: Department}>(`${this.baseUrl}/api/Departments/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDepartmentResponse(response.data);
          }
          throw new Error(response.message || 'Bölüm bulunamadı');
        }),
        catchError(this.handleError)
      );
  }

  getPopularDepartments(count: number = 8): Observable<Department[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<{success: boolean, message: string, data: Department[]}>(`${this.baseUrl}/api/Departments/popular`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(dept => this.mapDepartmentResponse(dept));
          }
          throw new Error(response.message || 'Popüler bölümler yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  createDepartment(request: DepartmentCreateRequest): Observable<Department> {
    const formData = this.buildFormData(request);
    return this.http.post<{success: boolean, message: string, data: Department}>(`${this.baseUrl}/api/Departments`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDepartmentResponse(response.data);
          }
          throw new Error(response.message || 'Bölüm oluşturulamadı');
        }),
        catchError(this.handleError)
      );
  }

  updateDepartment(id: number, request: DepartmentUpdateRequest): Observable<Department> {
    const formData = this.buildFormData(request);
    return this.http.put<{success: boolean, message: string, data: Department}>(`${this.baseUrl}/api/Departments/${id}`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapDepartmentResponse(response.data);
          }
          throw new Error(response.message || 'Bölüm güncellenemedi');
        }),
        catchError(this.handleError)
      );
  }

  deleteDepartment(id: number): Observable<boolean> {
    return this.http.delete<{success: boolean, message: string}>(`${this.baseUrl}/api/Departments/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Bölüm silinemedi');
        }),
        catchError(this.handleError)
      );
  }

  // Department Menu Operations
  getDepartmentMenus(departmentId: number): Observable<DepartmentMenu[]> {
    return this.http.get<{success: boolean, message: string, data: DepartmentMenu[]}>(`${this.baseUrl}/api/DepartmentMenus/department/${departmentId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  getDepartmentMenuById(id: number): Observable<DepartmentMenu> {
    return this.http.get<{success: boolean, message: string, data: DepartmentMenu}>(`${this.baseUrl}/api/DepartmentMenus/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError)
      );
  }

  createDepartmentMenu(request: DepartmentMenuCreateRequest): Observable<DepartmentMenu> {
    return this.http.post<{success: boolean, message: string, data: DepartmentMenu}>(`${this.baseUrl}/api/DepartmentMenus`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulamadı');
        }),
        catchError(this.handleError)
      );
  }

  updateDepartmentMenu(id: number, request: DepartmentMenuUpdateRequest): Observable<DepartmentMenu> {
    return this.http.put<{success: boolean, message: string, data: DepartmentMenu}>(`${this.baseUrl}/api/DepartmentMenus/${id}`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenemedi');
        }),
        catchError(this.handleError)
      );
  }

  deleteDepartmentMenu(id: number): Observable<boolean> {
    return this.http.delete<{success: boolean, message: string}>(`${this.baseUrl}/api/DepartmentMenus/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinemedi');
        }),
        catchError(this.handleError)
      );
  }

  // Helper Methods
  private mapDepartmentResponse(department: any): Department {
    return {
      ...department,
      createdDate: new Date(department.createdDate),
      updatedDate: department.updatedDate ? new Date(department.updatedDate) : undefined
    };
  }

  private mapMenuResponse(menu: any): DepartmentMenu {
    return {
      ...menu,
      createdDate: new Date(menu.createdDate),
      updatedDate: menu.updatedDate ? new Date(menu.updatedDate) : undefined
    };
  }

  getDepartmentImageUrl(imagePath?: string): string {
    return this.getImageUrl(imagePath);
  }
}