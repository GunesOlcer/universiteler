import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  ProgramRanking,
  ProgramRankingCreateRequest,
  ProgramRankingUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProgramRankingService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getByProgramId(programId: number): Observable<ApiResponse<ProgramRanking[]>> {
    return this.http.get<ApiResponse<ProgramRanking[]>>(`${this.baseUrl}/api/ProgramRankings/program/${programId}`);
  }

  getById(id: number): Observable<ApiResponse<ProgramRanking>> {
    return this.http.get<ApiResponse<ProgramRanking>>(`${this.baseUrl}/api/ProgramRankings/${id}`);
  }

  create(request: ProgramRankingCreateRequest): Observable<ApiResponse<ProgramRanking>> {
    return this.http.post<ApiResponse<ProgramRanking>>(`${this.baseUrl}/api/ProgramRankings`, request);
  }

  update(id: number, request: ProgramRankingUpdateRequest): Observable<ApiResponse<ProgramRanking>> {
    return this.http.put<ApiResponse<ProgramRanking>>(`${this.baseUrl}/api/ProgramRankings/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/ProgramRankings/${id}`);
  }
}