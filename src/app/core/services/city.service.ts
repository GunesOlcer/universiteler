import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  City,
  CityCreateRequest,
  CityUpdateRequest,
  CityFilterParams,
  RegionType
} from '../models/city.model';
import { 
  ApiResponse, 
  ListResponse,
  BaseResponse,
  PagedResponse
} from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService {
  private endpoint = 'api/Cities';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<City[]> {
    console.log('🌍 [CityService] Getting all cities');
    
    return this.http.get<ListResponse<City>>(`${this.baseUrl}/${this.endpoint}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CityService] Cities response:', response);
          if (response.success) {
            return response.data.map(city => this.mapCityResponse(city));
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getAllPaginated(params: CityFilterParams): Observable<PagedResponse<City>> {
    console.log('📄 [CityService] Getting paginated cities:', params);
    
    const httpParams = this.buildHttpParams({
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
      searchTerm: params.searchTerm || '',
      status: params.status,
      countryId: params.countryId,
      region: params.region
    });

    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}/paginated`, { 
      ...this.getHttpOptions(), 
      params: httpParams 
    })
      .pipe(
        map(response => {
          console.log('📡 [CityService] Paginated response:', response);
          if (response.success) {
            return {
              success: response.success,
              message: response.message,
              data: response.data.map((city: any) => this.mapCityResponse(city)),
              pageNumber: response.pageNumber,
              pageSize: response.pageSize,
              totalItems: response.totalItems,
              totalPages: response.totalPages
            } as PagedResponse<City>;
          }
          throw new Error(response.message || 'Failed to load cities');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getById(id: number): Observable<City> {
    console.log('🔍 [CityService] Getting city by ID:', id);
    
    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CityService] City by ID response:', response);
          if (response.success && response.data) {
            return this.mapCityResponse(response.data);
          }
          throw new Error(response.message || 'Şehir bulunamadı');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getByRegion(region: RegionType): Observable<City[]> {
    console.log('🗺️ [CityService] Getting cities by region:', region);
    
    const httpParams = this.buildHttpParams({ region });

    return this.http.get<ListResponse<City>>(`${this.baseUrl}/${this.endpoint}/by-region`, { 
      ...this.getHttpOptions(), 
      params: httpParams 
    })
      .pipe(
        map(response => {
          console.log('📡 [CityService] Cities by region response:', response);
          if (response.success) {
            return response.data.map(city => this.mapCityResponse(city));
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getPopular(count: number = 6): Observable<City[]> {
    console.log('⭐ [CityService] Getting popular cities, count:', count);
    
    const httpParams = this.buildHttpParams({ count });

    return this.http.get<ListResponse<City>>(`${this.baseUrl}/${this.endpoint}/popular`, { 
      ...this.getHttpOptions(), 
      params: httpParams 
    })
      .pipe(
        map(response => {
          console.log('📡 [CityService] Popular cities response:', response);
          if (response.success) {
            return response.data.map(city => this.mapCityResponse(city));
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  create(request: CityCreateRequest): Observable<City> {
    console.log('➕ [CityService] Creating city:', request);
    
    // Create a clean request object for FormData
    const cleanRequest = {
      name: request.name,
      description: request.description || '',
      countryId: request.countryId,
      region: request.region,
      population: request.population,
      studentPopulation: request.studentPopulation,
      hasAirport: request.hasAirport || false,
      hasTrainStation: request.hasTrainStation || false,
      hasHighSpeedTrain: request.hasHighSpeedTrain || false,
      status: request.status
    };

    // Add image if provided
    if (request.image) {
      (cleanRequest as any).image = request.image;
    }
    
    const formData = this.buildFormData(cleanRequest);
    
    console.log('📋 [CityService] FormData contents:');
    formData.forEach((value, key) => {
      console.log(`  ${key}:`, value);
    });
    
    return this.http.post<any>(`${this.baseUrl}/${this.endpoint}`, formData, this.getHttpOptionsForFormData())
      .pipe(
        map(response => {
          console.log('📡 [CityService] Create response:', response);
          if (response.success && response.data) {
            return this.mapCityResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  update(id: number, request: CityUpdateRequest): Observable<City> {
    console.log('✏️ [CityService] Updating city:', id, request);
    
    // Create a clean request object for FormData
    const cleanRequest = {
      id: request.id,
      name: request.name,
      description: request.description || '',
      countryId: request.countryId,
      region: request.region,
      population: request.population,
      studentPopulation: request.studentPopulation,
      hasAirport: request.hasAirport || false,
      hasTrainStation: request.hasTrainStation || false,
      hasHighSpeedTrain: request.hasHighSpeedTrain || false,
      status: request.status,
      existingImagePath: request.existingImagePath || ''
    };

    // Add image if provided
    if (request.image) {
      (cleanRequest as any).image = request.image;
    }
    
    const formData = this.buildFormData(cleanRequest);
    
    return this.http.put<any>(`${this.baseUrl}/${this.endpoint}/${id}`, formData, this.getHttpOptionsForFormData())
      .pipe(
        map(response => {
          console.log('📡 [CityService] Update response:', response);
          if (response.success && response.data) {
            return this.mapCityResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  delete(id: number): Observable<boolean> {
    console.log('🗑️ [CityService] Deleting city:', id);
    
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/${id}`, this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CityService] Delete response:', response);
          if (response.success) {
            return true;
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateStatus(id: number, status: number): Observable<City> {
    console.log('🔄 [CityService] Updating city status:', { id, status });
    
    return this.http.patch<any>(`${this.baseUrl}/${this.endpoint}/${id}/status`, 
      { status }, 
      this.getHttpOptions())
      .pipe(
        map(response => {
          console.log('📡 [CityService] Status update response:', response);
          if (response.success && response.data) {
            return this.mapCityResponse(response.data);
          }
          throw new Error(response.message);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private mapCityResponse(city: any): City {
    return {
      ...city,
      createdDate: new Date(city.createdDate),
      updatedDate: city.updatedDate ? new Date(city.updatedDate) : undefined,
      imageUrl: city.imagePath ? this.getImageUrl(city.imagePath) : undefined
    } as City;
  }
}