import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { 
  Article,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleListRequest,
  ArticleCategory
} from '../models/article.model';
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
export class ArticleService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<Article[]> {
    return this.http.get<ListResponse<Article>>(`${this.baseUrl}/api/Articles`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(article => this.transformArticle(article));
          }
          throw new Error(response.message || 'Failed to fetch articles');
        }),
        catchError(this.handleError)
      );
  }

  getAllPaginated(request: ArticleListRequest): Observable<PagedResponse<Article>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber.toString())
      .set('pageSize', request.pageSize.toString());

    if (request.searchTerm) {
      params = params.set('searchTerm', request.searchTerm);
    }
    if (request.status !== undefined) {
      params = params.set('status', request.status.toString());
    }
    if (request.category !== undefined) {
      params = params.set('category', request.category.toString());
    }

    return this.http.get<PagedResponse<Article>>(`${this.baseUrl}/api/Articles/paginated`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return {
              ...response,
              data: response.data.map(article => this.transformArticle(article))
            };
          }
          throw new Error(response.message || 'Failed to fetch articles');
        }),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Article> {
    return this.http.get<ApiResponse<Article>>(`${this.baseUrl}/api/Articles/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformArticle(response.data);
          }
          throw new Error(response.message || 'Article not found');
        }),
        catchError(this.handleError)
      );
  }

  getBySlug(slug: string): Observable<Article> {
    return this.http.get<ApiResponse<Article>>(`${this.baseUrl}/api/Articles/slug/${slug}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformArticle(response.data);
          }
          throw new Error(response.message || 'Article not found');
        }),
        catchError(this.handleError)
      );
  }

  getLatest(count: number = 6): Observable<Article[]> {
    const params = new HttpParams().set('count', count.toString());
    return this.http.get<ListResponse<Article>>(`${this.baseUrl}/api/Articles/latest`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(article => this.transformArticle(article));
          }
          throw new Error(response.message || 'Failed to fetch latest articles');
        }),
        catchError(this.handleError)
      );
  }

  getByCategory(category: ArticleCategory): Observable<Article[]> {
    const params = new HttpParams().set('category', category.toString());
    return this.http.get<ListResponse<Article>>(`${this.baseUrl}/api/Articles/category`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(article => this.transformArticle(article));
          }
          throw new Error(response.message || 'Failed to fetch articles by category');
        }),
        catchError(this.handleError)
      );
  }

  getByTag(tag: string): Observable<Article[]> {
    const params = new HttpParams().set('tag', tag);
    return this.http.get<ListResponse<Article>>(`${this.baseUrl}/api/Articles/tag`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.map(article => this.transformArticle(article));
          }
          throw new Error(response.message || 'Failed to fetch articles by tag');
        }),
        catchError(this.handleError)
      );
  }

  create(request: ArticleCreateRequest): Observable<Article> {
    const formData = this.buildFormData(request);
    return this.http.post<ApiResponse<Article>>(`${this.baseUrl}/api/Articles`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformArticle(response.data);
          }
          throw new Error(response.message || 'Failed to create article');
        }),
        catchError(this.handleError)
      );
  }

  update(id: number, request: ArticleUpdateRequest): Observable<Article> {
    const formData = this.buildFormData(request);
    return this.http.put<ApiResponse<Article>>(`${this.baseUrl}/api/Articles/${id}`, formData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return this.transformArticle(response.data);
          }
          throw new Error(response.message || 'Failed to update article');
        }),
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<BaseResponse>(`${this.baseUrl}/api/Articles/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete article');
          }
        }),
        catchError(this.handleError)
      );
  }

  private transformArticle(article: any): Article {
    return {
      ...article,
      createdDate: new Date(article.createdDate),
      updatedDate: article.updatedDate ? new Date(article.updatedDate) : undefined,
      publishDate: new Date(article.publishDate),
      imagePath: article.imagePath ? `${this.baseUrl}/${article.imagePath}` : undefined
    };
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/articles/default-article.jpg';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${this.baseUrl}/${imagePath}`;
  }
}