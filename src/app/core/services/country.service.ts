import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Country,
  CountryCreateRequest,
  CountryUpdateRequest,
  CountryFilterParams
} from '../models/country.model';
import { 
  ApiResponse, 
  ListResponse,
  BaseResponse,
  PagedResponse
} from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService {
  private endpoint = 'api/Countries';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<Country[]> {
    console.log('🌍 [CountryService] Getting all countries');
    
    return this.http.get<ListResponse<Country>>(`${this.baseUrl}/${this.endpoint}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Countries response:', response);
          if (response.success) {
            return response.data.map(country => this.mapCountryResponse(country));
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getAllPaginated(params: CountryFilterParams): Observable<PagedResponse<Country>> {
    console.log('📄 [CountryService] Getting paginated countries:', params);
    
    const httpParams = this.buildHttpParams({
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
      searchTerm: params.searchTerm || '',
      status: params.status
    });

    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}/paginated`, { 
      ...this.getHttpOptions(), 
      params: httpParams 
    })
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Paginated response:', response);
          if (response.success) {
            return {
              success: response.success,
              message: response.message,
              data: response.data.map((country: any) => this.mapCountryResponse(country)),
              pageNumber: response.pageNumber,
              pageSize: response.pageSize,
              totalItems: response.totalItems,
              totalPages: response.totalPages
            } as PagedResponse<Country>;
          }
          throw new Error(response.message || 'Failed to load countries');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getById(id: number): Observable<Country> {
    console.log('🔍 [CountryService] Getting country by ID:', id);
    
    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Country by ID response:', response);
          if (response.success && response.data) {
            return this.mapCountryResponse(response.data);
          }
          throw new Error(response.message || 'Ülke bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  create(request: CountryCreateRequest): Observable<Country> {
    console.log('➕ [CountryService] Creating country:', request);
    
    return this.http.post<any>(`${this.baseUrl}/${this.endpoint}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Create response:', response);
          if (response.success && response.data) {
            return this.mapCountryResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  update(id: number, request: CountryUpdateRequest): Observable<Country> {
    console.log('✏️ [CountryService] Updating country:', id, request);
    
    return this.http.put<any>(`${this.baseUrl}/${this.endpoint}/${id}`, request, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Update response:', response);
          if (response.success && response.data) {
            return this.mapCountryResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  delete(id: number): Observable<boolean> {
    console.log('🗑️ [CountryService] Deleting country:', id);
    
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Delete response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateStatus(id: number, status: number): Observable<Country> {
    console.log('🔄 [CountryService] Updating country status:', { id, status });
    
    return this.http.patch<any>(`${this.baseUrl}/${this.endpoint}/${id}/status`, 
      { status }, 
      this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CountryService] Status update response:', response);
          if (response.success && response.data) {
            return this.mapCountryResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private mapCountryResponse(country: any): Country {
    return {
      ...country,
      createdDate: new Date(country.createdDate),
      updatedDate: country.updatedDate ? new Date(country.updatedDate) : undefined
    } as Country;
  }
}