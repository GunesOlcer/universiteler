import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  AdminPermission,
  AdminPermissionCreateRequest,
  AdminPermissionUpdateRequest,
  AssignPermissionRequest,
  UserPermissions,
  RolePermissions,
  PermissionModuleInfo,
  PaginatedResult,
  PaginationParams,
  ApiResponse,
  PermissionModule,
  PermissionType
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminPermissionService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<AdminPermission[]>> {
    return this.http.get<ApiResponse<AdminPermission[]>>(`${this.baseUrl}/api/AdminPermissions`);
  }

  getById(id: number): Observable<ApiResponse<AdminPermission>> {
    return this.http.get<ApiResponse<AdminPermission>>(`${this.baseUrl}/api/AdminPermissions/${id}`);
  }

  getPaginated(pagination: PaginationParams, searchTerm?: string): Observable<PaginatedResult<AdminPermission>> {
    const params = this.buildHttpParams({ ...pagination, searchTerm });
    return this.http.get<PaginatedResult<AdminPermission>>(`${this.baseUrl}/api/AdminPermissions/paginated`, { params });
  }

  create(request: AdminPermissionCreateRequest): Observable<ApiResponse<AdminPermission>> {
    return this.http.post<ApiResponse<AdminPermission>>(`${this.baseUrl}/api/AdminPermissions`, request);
  }

  update(id: number, request: AdminPermissionUpdateRequest): Observable<ApiResponse<AdminPermission>> {
    return this.http.put<ApiResponse<AdminPermission>>(`${this.baseUrl}/api/AdminPermissions/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/${id}`);
  }

  getUserPermissions(userId: number): Observable<ApiResponse<UserPermissions>> {
    return this.http.get<ApiResponse<UserPermissions>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}`);
  }

  getUserDirectPermissions(userId: number): Observable<ApiResponse<AdminPermission[]>> {
    return this.http.get<ApiResponse<AdminPermission[]>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/direct`);
  }

  getUserRolePermissions(userId: number): Observable<ApiResponse<AdminPermission[]>> {
    return this.http.get<ApiResponse<AdminPermission[]>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/roles`);
  }

  assignPermissionToUser(userId: number, request: AssignPermissionRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/assign`, request);
  }

  removePermissionFromUser(userId: number, module: PermissionModule, type: PermissionType): Observable<ApiResponse<any>> {
    const params = this.buildHttpParams({ module, type });
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/remove`, { params });
  }

  assignMultiplePermissionsToUser(userId: number, permissions: AdminPermissionCreateRequest[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/assign-multiple`, permissions);
  }

  removeAllUserPermissions(userId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/users/${userId}/remove-all`);
  }

  getRolePermissions(roleId: number): Observable<ApiResponse<RolePermissions>> {
    return this.http.get<ApiResponse<RolePermissions>>(`${this.baseUrl}/api/AdminPermissions/roles/${roleId}`);
  }

  assignPermissionToRole(roleId: number, request: AssignPermissionRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/roles/${roleId}/assign`, request);
  }

  removePermissionFromRole(roleId: number, module: PermissionModule, type: PermissionType): Observable<ApiResponse<any>> {
    const params = this.buildHttpParams({ module, type });
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/roles/${roleId}/remove`, { params });
  }

  assignMultiplePermissionsToRole(roleId: number, permissions: AdminPermissionCreateRequest[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/roles/${roleId}/assign-multiple`, permissions);
  }

  removeAllRolePermissions(roleId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/AdminPermissions/roles/${roleId}/remove-all`);
  }

  checkUserPermission(userId: number, module: PermissionModule, type: PermissionType): Observable<ApiResponse<{ hasPermission: boolean }>> {
    const params = this.buildHttpParams({ module, type });
    return this.http.get<ApiResponse<{ hasPermission: boolean }>>(`${this.baseUrl}/api/AdminPermissions/check/${userId}`, { params });
  }

  getAvailablePermissions(): Observable<ApiResponse<PermissionModuleInfo[]>> {
    return this.http.get<ApiResponse<PermissionModuleInfo[]>>(`${this.baseUrl}/api/AdminPermissions/available`);
  }

  getUserAvailablePermissions(userId: number): Observable<ApiResponse<PermissionModuleInfo[]>> {
    return this.http.get<ApiResponse<PermissionModuleInfo[]>>(`${this.baseUrl}/api/AdminPermissions/available/${userId}`);
  }

  getPermissionsByModule(module: PermissionModule): Observable<ApiResponse<AdminPermission[]>> {
    return this.http.get<ApiResponse<AdminPermission[]>>(`${this.baseUrl}/api/AdminPermissions/module/${module}`);
  }

  getPermissionsByType(type: PermissionType): Observable<ApiResponse<AdminPermission[]>> {
    return this.http.get<ApiResponse<AdminPermission[]>>(`${this.baseUrl}/api/AdminPermissions/type/${type}`);
  }

  getUsersWithPermission(module: PermissionModule, type: PermissionType): Observable<ApiResponse<any[]>> {
    const params = this.buildHttpParams({ module, type });
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/api/AdminPermissions/users-with-permission`, { params });
  }

  getRolesWithPermission(module: PermissionModule, type: PermissionType): Observable<ApiResponse<any[]>> {
    const params = this.buildHttpParams({ module, type });
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/api/AdminPermissions/roles-with-permission`, { params });
  }
}