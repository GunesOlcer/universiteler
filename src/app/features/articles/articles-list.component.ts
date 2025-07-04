import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { 
  Article, 
  ArticleCategory, 
  getCategoryName, 
  getCategoryKey, 
  getCategoryFromKey 
} from '../../core/models/article.model';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  allArticles: Article[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Search and Filter
  searchTerm = '';
  private searchSubject = new Subject<string>();
  activeFilter: string = 'all';
  categoryCounts: { [key: number]: number } = {};
  
  // Pagination
  isPaginated = false;
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  
  // View
  viewMode: 'grid' | 'list' = 'grid';
  
  // Page info
  pageTitle = 'Makaleler';
  breadcrumbItems = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Makaleler', path: null }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      // Handle search parameter
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      
      // Handle category parameter
      if (params['category']) {
        this.activeFilter = params['category'];
        if (this.activeFilter !== 'all') {
          this.updateBreadcrumbForCategory(this.activeFilter);
        }
      }
      
      // Handle pagination parameters
      if (params['page']) {
        this.currentPage = parseInt(params['page'], 10) || 1;
      }
      
      if (params['size']) {
        this.pageSize = parseInt(params['size'], 10) || 12;
      }

      this.loadArticles();
    });

    // Load category counts
    this.loadCategoryCounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Determine if we should use pagination based on filters
    const shouldPaginate = this.searchTerm === '' && this.activeFilter === 'all';
    this.isPaginated = shouldPaginate;

    if (shouldPaginate) {
      this.loadArticlesPaginated();
    } else {
      this.loadAllArticles();
    }
  }

  private loadArticlesPaginated(): void {
    const request = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      category: this.activeFilter !== 'all' ? getCategoryFromKey(this.activeFilter) || undefined : undefined
    };

    this.articleService.getAllPaginated(request).subscribe({
      next: (response) => {
        this.articles = response.data;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Makaleler yüklenirken bir hata oluştu.';
        this.isLoading = false;
        this.articles = [];
      }
    });
  }

  private loadAllArticles(): void {
    this.articleService.getAll().subscribe({
      next: (articles) => {
        this.allArticles = articles;
        this.applyClientSideFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Makaleler yüklenirken bir hata oluştu.';
        this.isLoading = false;
        this.articles = [];
      }
    });
  }

  private loadCategoryCounts(): void {
    this.articleService.getAll().subscribe({
      next: (articles) => {
        this.categoryCounts = {};
        articles.forEach(article => {
          this.categoryCounts[article.category] = (this.categoryCounts[article.category] || 0) + 1;
        });
      },
      error: (error) => {
        console.error('Error loading category counts:', error);
      }
    });
  }

  private applyClientSideFilters(): void {
    let filtered = [...this.allArticles];

    // Apply category filter
    if (this.activeFilter !== 'all') {
      const category = getCategoryFromKey(this.activeFilter);
      if (category) {
        filtered = filtered.filter(article => article.category === category);
      }
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(search) || 
        article.summary.toLowerCase().includes(search) ||
        article.content.toLowerCase().includes(search) ||
        article.author.toLowerCase().includes(search) ||
        article.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    this.articles = filtered;
    this.totalItems = filtered.length;
  }

  applyFilter(filter: string): void {
    if (this.activeFilter === filter) return;
    
    this.activeFilter = filter;
    this.currentPage = 1;
    
    // Update page title and breadcrumb
    if (filter === 'all') {
      this.pageTitle = 'Makaleler';
      this.breadcrumbItems = [
        { label: 'Ana Sayfa', path: '/' },
        { label: 'Makaleler', path: null }
      ];
    } else {
      this.updateBreadcrumbForCategory(filter);
    }

    // Update URL
    this.updateUrl();
    
    // Load articles
    this.loadArticles();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateUrl();
    this.loadArticles();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.currentPage = 1;
    this.pageTitle = 'Makaleler';
    this.breadcrumbItems = [
      { label: 'Ana Sayfa', path: '/' },
      { label: 'Makaleler', path: null }
    ];
    this.updateUrl();
    this.loadArticles();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.updateUrl();
    this.loadArticles();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }
      
      if (this.currentPage < this.totalPages - 3) {
        pages.push('...');
      }
      
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  private updateBreadcrumbForCategory(categoryKey: string): void {
    const categoryDisplayName = this.getCategoryDisplayName(categoryKey);
    this.pageTitle = categoryDisplayName;
    this.breadcrumbItems = [
      { label: 'Ana Sayfa', path: '/' },
      { label: 'Makaleler', path: '/makaleler' },
      { label: categoryDisplayName, path: null }
    ];
  }

  private updateUrl(): void {
    const queryParams: any = {};
    
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    
    if (this.activeFilter !== 'all') {
      queryParams.category = this.activeFilter;
    }
    
    if (this.isPaginated && this.currentPage > 1) {
      queryParams.page = this.currentPage;
    }
    
    if (this.pageSize !== 12) {
      queryParams.size = this.pageSize;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'  // Fixed: using 'merge' instead of 'replace'
    });
  }

  getCategoryDisplayName(categoryKey: string): string {
    const category = getCategoryFromKey(categoryKey);
    return category ? getCategoryName(category) : 'Bilinmiyor';
  }

  getTotalCount(): number {
    return Object.values(this.categoryCounts).reduce((sum, count) => sum + count, 0);
  }

  trackByArticleId(index: number, article: Article): number {
    return article.id;
  }

  // Math function for template
  Math = Math;
}