import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  Article, 
  ArticleCategory, 
  getCategoryName, 
  getCategoryKey 
} from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  relatedArticles: Article[] = [];
  latestArticles: Article[] = [];
  isLoading = false;
  errorMessage = '';
  
  // UI State
  showShareMenu = false;
  isLiked = false;
  isBookmarked = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = parseInt(params['id'], 10);
      if (id && !isNaN(id)) {
        this.loadArticle(id);
      } else {
        this.errorMessage = 'Geçersiz makale ID\'si';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.share-dropdown')) {
      this.showShareMenu = false;
    }
  }

  loadArticle(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.articleService.getById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.loadRelatedContent();
        this.loadUserPreferences();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Makale yüklenirken bir hata oluştu.';
        this.isLoading = false;
        this.article = null;
      }
    });
  }

  private loadRelatedContent(): void {
    if (!this.article) return;

    // Load related articles by category
    this.articleService.getByCategory(this.article.category).subscribe({
      next: (articles) => {
        this.relatedArticles = articles
          .filter(a => a.id !== this.article!.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related articles:', error);
      }
    });

    // Load latest articles
    this.articleService.getLatest(5).subscribe({
      next: (articles) => {
        this.latestArticles = articles
          .filter(a => a.id !== this.article!.id)
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading latest articles:', error);
      }
    });
  }

  private loadUserPreferences(): void {
    if (!this.article) return;
    
    // Load from localStorage or user service
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    
    this.isLiked = likedArticles.includes(this.article.id);
    this.isBookmarked = bookmarkedArticles.includes(this.article.id);
  }

  getImageUrl(): string | null {
    return this.article?.imagePath ? this.articleService.getImageUrl(this.article.imagePath) : null;
  }

  getCategoryDisplayName(): string {
    return this.article ? getCategoryName(this.article.category) : '';
  }

  getCategoryKey(): string {
    return this.article ? getCategoryKey(this.article.category) : '';
  }

  getFormattedContent(): string {
    if (!this.article?.content) return '';
    
    // Basic content formatting - convert line breaks to paragraphs
    return this.article.content
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }

  toggleShare(): void {
    this.showShareMenu = !this.showShareMenu;
  }

  getShareUrl(platform: string): string {
    if (!this.article) return '#';
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.article.title);
    const description = encodeURIComponent(this.article.summary);
    
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case 'whatsapp':
        return `https://wa.me/?text=${title}%20${url}`;
      default:
        return '#';
    }
  }

  copyUrl(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showShareMenu = false;
        // You could show a toast notification here
        alert('Link kopyalandı!');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showShareMenu = false;
      alert('Link kopyalandı!');
    }
  }

  toggleLike(): void {
    if (!this.article) return;
    
    this.isLiked = !this.isLiked;
    
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    if (this.isLiked) {
      likedArticles.push(this.article.id);
    } else {
      const index = likedArticles.indexOf(this.article.id);
      if (index > -1) {
        likedArticles.splice(index, 1);
      }
    }
    localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
  }

  toggleBookmark(): void {
    if (!this.article) return;
    
    this.isBookmarked = !this.isBookmarked;
    
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    if (this.isBookmarked) {
      bookmarkedArticles.push(this.article.id);
    } else {
      const index = bookmarkedArticles.indexOf(this.article.id);
      if (index > -1) {
        bookmarkedArticles.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
  }

  getAuthorArticleCount(): number {
    // This would typically come from an API call
    return Math.floor(Math.random() * 20) + 5; // Mock data
  }
}