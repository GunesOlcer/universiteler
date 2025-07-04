import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Article } from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-latest-articles',
  templateUrl: './latest-articles.component.html',
  styleUrls: ['./latest-articles.component.scss']
})
export class LatestArticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('articlesGrid') articlesGrid!: ElementRef;
  
  articles: Article[] = [];
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();
  
  constructor(private articleService: ArticleService) {}
  
  ngOnInit(): void {
    this.loadArticles();
  }
  
  ngAfterViewInit(): void {
    // Mobil görünümde kaydırma davranışını iyileştirmek için
    if (this.isMobile() && this.articlesGrid) {
      this.articlesGrid.nativeElement.addEventListener('scroll', () => {
        // Kaydırma olayı (gerekirse burada kaydırma ile ilgili ek işlemler yapılabilir)
      }, { passive: true });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.articleService.getLatest(6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading latest articles:', error);
          this.errorMessage = error.message || 'Makaleler yüklenirken bir hata oluştu.';
          this.isLoading = false;
          this.articles = [];
        }
      });
  }
  
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
  
  retryLoad(): void {
    this.loadArticles();
  }
}