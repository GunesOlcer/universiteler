import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { 
  HelpTopic,
  HelpTopicCreateRequest,
  HelpTopicUpdateRequest,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class HelpTopicService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ApiResponse<HelpTopic[]>> {
    return this.http.get<ApiResponse<HelpTopic[]>>(`${this.baseUrl}/api/HelpTopics`);
  }

  getById(id: number): Observable<ApiResponse<HelpTopic>> {
    return this.http.get<ApiResponse<HelpTopic>>(`${this.baseUrl}/api/HelpTopics/${id}`);
  }

  create(request: HelpTopicCreateRequest): Observable<ApiResponse<HelpTopic>> {
    return this.http.post<ApiResponse<HelpTopic>>(`${this.baseUrl}/api/HelpTopics`, request);
  }

  update(id: number, request: HelpTopicUpdateRequest): Observable<ApiResponse<HelpTopic>> {
    return this.http.put<ApiResponse<HelpTopic>>(`${this.baseUrl}/api/HelpTopics/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/HelpTopics/${id}`);
  }
}