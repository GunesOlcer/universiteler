import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  User,
  UserCreateRequest,
  UserUpdateRequest,
  ApiResponse,
  SingleResponse,
  ListResponse,
  PagedResponse,
  PaginationParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private endpoint = 'api/Users';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(params?: PaginationParams): Observable<ListResponse<User>> {
    console.log('👥 [UserService] Getting all users');
    
    let url = `${this.baseUrl}/${this.endpoint}`;
    const httpParams = params ? this.buildHttpParams(params) : undefined;
    
    return this.http.get<ListResponse<User>>(url, { 
      ...this.getHttpOptions(),
      params: httpParams 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getAllPaged(params: PaginationParams): Observable<PagedResponse<User>> {
    console.log('👥 [UserService] Getting paged users');
    
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<PagedResponse<User>>(`${this.baseUrl}/${this.endpoint}/paged`, {
      ...this.getHttpOptions(),
      params: httpParams
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getById(id: number): Observable<SingleResponse<User>> {
    console.log('👤 [UserService] Getting user by ID:', id);
    
    return this.http.get<SingleResponse<User>>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  create(request: UserCreateRequest): Observable<SingleResponse<User>> {
    console.log('➕ [UserService] Creating user');
    
    const formData = this.buildFormData(request);
    return this.http.post<SingleResponse<User>>(`${this.baseUrl}/${this.endpoint}`, formData, this.getHttpOptionsForFormData())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  update(id: number, request: UserUpdateRequest): Observable<SingleResponse<User>> {
    console.log('✏️ [UserService] Updating user:', id);
    
    const formData = this.buildFormData(request);
    return this.http.put<SingleResponse<User>>(`${this.baseUrl}/${this.endpoint}/${id}`, formData, this.getHttpOptionsForFormData())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  delete(id: number): Observable<ApiResponse<any>> {
    console.log('🗑️ [UserService] Deleting user:', id);
    
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  updateStatus(id: number, status: number): Observable<SingleResponse<User>> {
    console.log('🔄 [UserService] Updating user status:', { id, status });
    
    return this.http.patch<SingleResponse<User>>(`${this.baseUrl}/${this.endpoint}/${id}/status`, 
      { status }, 
      this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  resetPassword(id: number, newPassword: string): Observable<ApiResponse<any>> {
    console.log('🔑 [UserService] Resetting password for user:', id);
    
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${this.endpoint}/${id}/reset-password`, 
      { newPassword }, 
      this.getHttpOptions())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  uploadProfileImage(id: number, file: File): Observable<SingleResponse<string>> {
    console.log('📸 [UserService] Uploading profile image for user:', id);
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return this.http.post<SingleResponse<string>>(`${this.baseUrl}/${this.endpoint}/${id}/profile-image`, 
      formData, 
      this.getHttpOptionsForFormData())
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}