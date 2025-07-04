// menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  CityMenu,
  CityMenuCreateRequest,
  CityMenuUpdateRequest,
   CountryMenu,          // ✅ EKLENDİ
  CountryMenuCreateRequest,  // ✅ EKLENDİ
  CountryMenuUpdateRequest,
  UniversityMenu,
  UniversityMenuCreateRequest,
  UniversityMenuUpdateRequest,
  DormitoryMenu,
  DormitoryMenuCreateRequest,
  DormitoryMenuUpdateRequest,
  ProgramMenu,
  ProgramMenuCreateRequest,
  ProgramMenuUpdateRequest
} from '../models/menu.model';
import {
  DepartmentMenu,
  DepartmentMenuCreateRequest,
  DepartmentMenuUpdateRequest
} from '../models/department.model';
import { 
  ApiResponse, 
  ListResponse,
  BaseResponse,
  SingleResponse
} from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // City Menu Methods
  getCityMenus(cityId: number): Observable<CityMenu[]> {
    console.log('📋 [MenuService] Getting city menus for cityId:', cityId);
    
    return this.http.get<ListResponse<CityMenu>>(`${this.baseUrl}/api/CityMenus/city/${cityId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] City menus response:', response);
          if (response.success) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getCityMenuById(id: number): Observable<CityMenu> {
    console.log('🔍 [MenuService] Getting city menu by ID:', id);
    
    return this.http.get<SingleResponse<CityMenu>>(`${this.baseUrl}/api/CityMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] City menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createCityMenu(request: CityMenuCreateRequest): Observable<CityMenu> {
    console.log('➕ [MenuService] Creating city menu:', request);
    
    return this.http.post<SingleResponse<CityMenu>>(`${this.baseUrl}/api/CityMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create city menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateCityMenu(id: number, request: CityMenuUpdateRequest): Observable<CityMenu> {
    console.log('✏️ [MenuService] Updating city menu:', id, request);
    
    return this.http.put<SingleResponse<CityMenu>>(`${this.baseUrl}/api/CityMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update city menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteCityMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting city menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/CityMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete city menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // University Menu Methods
  getUniversityMenus(universityId: number): Observable<ApiResponse<UniversityMenu[]>> {
    console.log('📋 [MenuService] Getting university menus for universityId:', universityId);
    
    return this.http.get<ListResponse<UniversityMenu>>(`${this.baseUrl}/api/UniversityMenus/university/${universityId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] University menus response:', response);
          if (response.success) {
            return {
              success: true,
              message: response.message,
              data: response.data.map(menu => this.mapMenuResponse(menu))
            };
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getUniversityMenuById(id: number): Observable<UniversityMenu> {
    console.log('🔍 [MenuService] Getting university menu by ID:', id);
    
    return this.http.get<SingleResponse<UniversityMenu>>(`${this.baseUrl}/api/UniversityMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] University menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createUniversityMenu(request: UniversityMenuCreateRequest): Observable<UniversityMenu> {
    console.log('➕ [MenuService] Creating university menu:', request);
    
    return this.http.post<SingleResponse<UniversityMenu>>(`${this.baseUrl}/api/UniversityMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create university menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateUniversityMenu(id: number, request: UniversityMenuUpdateRequest): Observable<UniversityMenu> {
    console.log('✏️ [MenuService] Updating university menu:', id, request);
    
    return this.http.put<SingleResponse<UniversityMenu>>(`${this.baseUrl}/api/UniversityMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update university menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteUniversityMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting university menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/UniversityMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete university menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Department Menu Methods
  getDepartmentMenus(departmentId: number): Observable<DepartmentMenu[]> {
    console.log('📋 [MenuService] Getting department menus for departmentId:', departmentId);
    
    return this.http.get<ListResponse<DepartmentMenu>>(`${this.baseUrl}/api/DepartmentMenus/department/${departmentId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Department menus response:', response);
          if (response.success) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getDepartmentMenuById(id: number): Observable<DepartmentMenu> {
    console.log('🔍 [MenuService] Getting department menu by ID:', id);
    
    return this.http.get<SingleResponse<DepartmentMenu>>(`${this.baseUrl}/api/DepartmentMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Department menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createDepartmentMenu(request: DepartmentMenuCreateRequest): Observable<DepartmentMenu> {
    console.log('➕ [MenuService] Creating department menu:', request);
    
    return this.http.post<SingleResponse<DepartmentMenu>>(`${this.baseUrl}/api/DepartmentMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create department menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateDepartmentMenu(id: number, request: DepartmentMenuUpdateRequest): Observable<DepartmentMenu> {
    console.log('✏️ [MenuService] Updating department menu:', id, request);
    
    return this.http.put<SingleResponse<DepartmentMenu>>(`${this.baseUrl}/api/DepartmentMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update department menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteDepartmentMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting department menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/DepartmentMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete department menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Dormitory Menu Methods
  getDormitoryMenus(dormitoryId: number): Observable<DormitoryMenu[]> {
    console.log('📋 [MenuService] Getting dormitory menus for dormitoryId:', dormitoryId);
    
    return this.http.get<ListResponse<DormitoryMenu>>(`${this.baseUrl}/api/DormitoryMenus/dormitory/${dormitoryId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Dormitory menus response:', response);
          if (response.success) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getDormitoryMenuById(id: number): Observable<DormitoryMenu> {
    console.log('🔍 [MenuService] Getting dormitory menu by ID:', id);
    
    return this.http.get<SingleResponse<DormitoryMenu>>(`${this.baseUrl}/api/DormitoryMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Dormitory menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createDormitoryMenu(request: DormitoryMenuCreateRequest): Observable<DormitoryMenu> {
    console.log('➕ [MenuService] Creating dormitory menu:', request);
    
    return this.http.post<SingleResponse<DormitoryMenu>>(`${this.baseUrl}/api/DormitoryMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create dormitory menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateDormitoryMenu(id: number, request: DormitoryMenuUpdateRequest): Observable<DormitoryMenu> {
    console.log('✏️ [MenuService] Updating dormitory menu:', id, request);
    
    return this.http.put<SingleResponse<DormitoryMenu>>(`${this.baseUrl}/api/DormitoryMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update dormitory menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteDormitoryMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting dormitory menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/DormitoryMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete dormitory menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Program Menu Methods
  getProgramMenus(programId: number): Observable<ProgramMenu[]> {
    console.log('📋 [MenuService] Getting program menus for programId:', programId);
    
    return this.http.get<ListResponse<ProgramMenu>>(`${this.baseUrl}/api/ProgramMenus/program/${programId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Program menus response:', response);
          if (response.success) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getProgramMenuById(id: number): Observable<ProgramMenu> {
    console.log('🔍 [MenuService] Getting program menu by ID:', id);
    
    return this.http.get<SingleResponse<ProgramMenu>>(`${this.baseUrl}/api/ProgramMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Program menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createProgramMenu(request: ProgramMenuCreateRequest): Observable<ProgramMenu> {
    console.log('➕ [MenuService] Creating program menu:', request);
    
    return this.http.post<SingleResponse<ProgramMenu>>(`${this.baseUrl}/api/ProgramMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create program menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateProgramMenu(id: number, request: ProgramMenuUpdateRequest): Observable<ProgramMenu> {
    console.log('✏️ [MenuService] Updating program menu:', id, request);
    
    return this.http.put<SingleResponse<ProgramMenu>>(`${this.baseUrl}/api/ProgramMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update program menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteProgramMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting program menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/ProgramMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete program menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getCountryMenus(countryId: number): Observable<CountryMenu[]> {
    console.log('📋 [MenuService] Getting country menus for countryId:', countryId);
    
    return this.http.get<ListResponse<CountryMenu>>(`${this.baseUrl}/api/CountryMenus/country/${countryId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Country menus response:', response);
          if (response.success) {
            return response.data.map(menu => this.mapMenuResponse(menu));
          }
          throw new Error(response.message || 'Menüler yüklenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getCountryMenuById(id: number): Observable<CountryMenu> {
    console.log('🔍 [MenuService] Getting country menu by ID:', id);
    
    return this.http.get<SingleResponse<CountryMenu>>(`${this.baseUrl}/api/CountryMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Country menu by ID response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createCountryMenu(request: CountryMenuCreateRequest): Observable<CountryMenu> {
    console.log('➕ [MenuService] Creating country menu:', request);
    
    return this.http.post<SingleResponse<CountryMenu>>(`${this.baseUrl}/api/CountryMenus`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Create country menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü oluşturulurken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateCountryMenu(id: number, request: CountryMenuUpdateRequest): Observable<CountryMenu> {
    console.log('✏️ [MenuService] Updating country menu:', id, request);
    
    return this.http.put<SingleResponse<CountryMenu>>(`${this.baseUrl}/api/CountryMenus/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Update country menu response:', response);
          if (response.success && response.data) {
            return this.mapMenuResponse(response.data);
          }
          throw new Error(response.message || 'Menü güncellenirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteCountryMenu(id: number): Observable<boolean> {
    console.log('🗑️ [MenuService] Deleting country menu:', id);
    
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/CountryMenus/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [MenuService] Delete country menu response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Menü silinirken hata oluştu');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // Private helper method
  private mapMenuResponse(menu: any): any {
    return {
      ...menu,
      createdDate: new Date(menu.createdDate),
      updatedDate: menu.updatedDate ? new Date(menu.updatedDate) : undefined
    };
  }

  trackByMenuId(index: number, menu: any): number {
    return menu.id;
  }
}