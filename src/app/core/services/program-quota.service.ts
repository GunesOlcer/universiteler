import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  ProgramQuota,
  ProgramQuotaCreateRequest,
  ProgramQuotaUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProgramQuotaService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getByProgramId(programId: number): Observable<ApiResponse<ProgramQuota[]>> {
    return this.http.get<ApiResponse<ProgramQuota[]>>(`${this.baseUrl}/api/ProgramQuotas/program/${programId}`);
  }

  getById(id: number): Observable<ApiResponse<ProgramQuota>> {
    return this.http.get<ApiResponse<ProgramQuota>>(`${this.baseUrl}/api/ProgramQuotas/${id}`);
  }

  create(request: ProgramQuotaCreateRequest): Observable<ApiResponse<ProgramQuota>> {
    return this.http.post<ApiResponse<ProgramQuota>>(`${this.baseUrl}/api/ProgramQuotas`, request);
  }

  update(id: number, request: ProgramQuotaUpdateRequest): Observable<ApiResponse<ProgramQuota>> {
    return this.http.put<ApiResponse<ProgramQuota>>(`${this.baseUrl}/api/ProgramQuotas/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/ProgramQuotas/${id}`);
  }
}