import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {
  articles: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  importantCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    title: '',
    status: '',
    importance: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  articleToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // Yeni makale ekle butonu için metod
  navigateToAddArticle(): void {
    this.router.navigate(['/admin/articles/add']);
  }

  loadArticles(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.contentService.getArticles(params).subscribe(
      (data: any) => {
        this.articles = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateCounts();
      },
      (error) => {
        console.error('Error loading articles:', error);
      }
    );
  }

  calculateCounts(): void {
    this.activeCount = this.articles.filter(a => a.isActive).length;
    this.importantCount = this.articles.filter(a => a.isImportant).length;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadArticles();
  }

  resetFilters(): void {
    this.filters = {
      title: '',
      status: '',
      importance: ''
    };
    this.currentPage = 1;
    this.loadArticles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadArticles();
  }

  confirmDelete(article: any): void {
    this.articleToDelete = article;
    this.showConfirmDialog = true;
  }

  deleteArticle(): void {
    if (this.articleToDelete) {
      this.contentService.deleteArticle(this.articleToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.articles = this.articles.filter(a => a.id !== this.articleToDelete.id);
          this.totalItems--;
          this.calculateCounts();
          this.showConfirmDialog = false;
          this.articleToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.articles.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadArticles();
          }
        },
        (error) => {
          console.error('Error deleting article:', error);
          this.showConfirmDialog = false;
          this.articleToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.articleToDelete = null;
  }
}