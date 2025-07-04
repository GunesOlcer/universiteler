import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  ArticleTag,
  ArticleTagCreateRequest,
  ArticleTagUpdateRequest
} from '../models/article-tag.model';
import { 
  ApiResponse,
  ListResponse,
  PagedResponse,
  BaseResponse,
  Status
} from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleTagService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ArticleTag[]> {
    return this.http.get<ListResponse<ArticleTag>>(`${this.baseUrl}/api/ArticleTags`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(tag => this.transformTag(tag));
          }
          throw new Error(response.message || 'Failed to fetch tags');
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<ArticleTag> {
    return this.http.get<ApiResponse<ArticleTag>>(`${this.baseUrl}/api/ArticleTags/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformTag(response.data);
          }
          throw new Error(response.message || 'Tag not found');
        }),
        catchError(this.handleError)
      );
  }

  create(request: ArticleTagCreateRequest): Observable<ArticleTag> {
    return this.http.post<ApiResponse<ArticleTag>>(`${this.baseUrl}/api/ArticleTags`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformTag(response.data);
          }
          throw new Error(response.message || 'Failed to create tag');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: ArticleTagUpdateRequest): Observable<ArticleTag> {
    return this.http.put<ApiResponse<ArticleTag>>(`${this.baseUrl}/api/ArticleTags/${id}`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformTag(response.data);
          }
          throw new Error(response.message || 'Failed to update tag');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/ArticleTags/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete tag');
          }
        }),
        catchError(this.handleError)
      );
  }

  private transformTag(tag: any): ArticleTag {
    return {
      ...tag,
      createdDate: new Date(tag.createdDate),
      updatedDate: tag.updatedDate ? new Date(tag.updatedDate) : undefined
    };
  }
}