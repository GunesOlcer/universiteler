import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  SelectionFilter,
  SelectionResult,
  SaveSelectionResultRequest,
  SelectionFilterRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  searchPrograms(filter: SelectionFilterRequest): Observable<SelectionResult[]> {
    return this.http.post<ApiResponse<SelectionResult[]>>(`${this.baseUrl}/api/Selection/search`, filter)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Arama başarısız');
        }),
        catchError(this.handleError)
      );
  }

  saveSelectionResult(request: SaveSelectionResultRequest): Observable<boolean> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/Selection/save-result`, request)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Kaydetme başarısız');
        }),
        catchError(this.handleError)
      );
  }

  getSavedSelections(userId: number): Observable<SelectionResult[]> {
    return this.http.get<ApiResponse<SelectionResult[]>>(`${this.baseUrl}/api/Selection/saved/${userId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Kayıtlı seçimler yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }
}