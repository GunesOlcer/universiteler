import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Program,
  ProgramCreateRequest,
  ProgramUpdateRequest,
  ProgramQuota,
  ProgramRanking,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<Program[]> {
    return this.http.get<ApiResponse<Program[]>>(`${this.baseUrl}/api/Programs`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(program => this.mapProgramResponse(program));
          }
          throw new Error(response.message || 'Programlar yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Program> {
    return this.http.get<ApiResponse<Program>>(`${this.baseUrl}/api/Programs/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapProgramResponse(response.data);
          }
          throw new Error(response.message || 'Program bulunamadı');
        }),
        catchError(this.handleError)
      );
  }

  getByDepartmentId(departmentId: number): Observable<Program[]> {
    return this.http.get<ApiResponse<Program[]>>(`${this.baseUrl}/api/Programs/department/${departmentId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(program => this.mapProgramResponse(program));
          }
          throw new Error(response.message || 'Bölüm programları yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  create(request: ProgramCreateRequest): Observable<Program> {
    return this.http.post<ApiResponse<Program>>(`${this.baseUrl}/api/Programs`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapProgramResponse(response.data);
          }
          throw new Error(response.message || 'Program oluşturulamadı');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: ProgramUpdateRequest): Observable<Program> {
    return this.http.put<ApiResponse<Program>>(`${this.baseUrl}/api/Programs/${id}`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.mapProgramResponse(response.data);
          }
          throw new Error(response.message || 'Program güncellenemedi');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/Programs/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return true;
          }
          throw new Error(response.message || 'Program silinemedi');
        }),
        catchError(this.handleError)
      );
  }

  // Program Quota Operations
  getProgramQuotas(programId: number): Observable<ProgramQuota[]> {
    return this.http.get<ApiResponse<ProgramQuota[]>>(`${this.baseUrl}/api/ProgramQuotas/program/${programId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(quota => this.mapQuotaResponse(quota));
          }
          throw new Error(response.message || 'Program kontenjanları yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  // Program Ranking Operations
  getProgramRankings(programId: number): Observable<ProgramRanking[]> {
    return this.http.get<ApiResponse<ProgramRanking[]>>(`${this.baseUrl}/api/ProgramRankings/program/${programId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(ranking => this.mapRankingResponse(ranking));
          }
          throw new Error(response.message || 'Program sıralamaları yüklenemedi');
        }),
        catchError(this.handleError)
      );
  }

  private mapProgramResponse(program: any): Program {
    return {
      ...program,
      createdDate: new Date(program.createdDate),
      updatedDate: program.updatedDate ? new Date(program.updatedDate) : undefined
    };
  }

  private mapQuotaResponse(quota: any): ProgramQuota {
    return {
      ...quota,
      createdDate: new Date(quota.createdDate),
      updatedDate: quota.updatedDate ? new Date(quota.updatedDate) : undefined
    };
  }

  private mapRankingResponse(ranking: any): ProgramRanking {
    return {
      ...ranking,
      createdDate: new Date(ranking.createdDate),
      updatedDate: ranking.updatedDate ? new Date(ranking.updatedDate) : undefined
    };
  }
}