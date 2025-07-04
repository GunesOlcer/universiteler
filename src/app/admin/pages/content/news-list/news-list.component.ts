import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Router'ı ekledik
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  news: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  importantCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    title: '',
    status: '',
    type: '',
    importance: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  newsToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private contentService: ContentService,
    private router: Router // Router'ı enjekte ettik
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  // Yeni haber ekle butonu için metod
  navigateToAddNews(): void {
    this.router.navigate(['/admin/news/add']);
  }

  loadNews(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.contentService.getNews(params).subscribe(
      (data: any) => {
        this.news = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateCounts();
      },
      (error) => {
        console.error('Error loading news:', error);
      }
    );
  }

  calculateCounts(): void {
    this.activeCount = this.news.filter(n => n.isActive).length;
    this.importantCount = this.news.filter(n => n.isImportant).length;
  }

  getNewsType(type: string): string {
    const types = {
      'news': 'Haber',
      'announcement': 'Duyuru'
    };
    return types[type] || type;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadNews();
  }

  resetFilters(): void {
    this.filters = {
      title: '',
      status: '',
      type: '',
      importance: ''
    };
    this.currentPage = 1;
    this.loadNews();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNews();
  }

  confirmDelete(news: any): void {
    this.newsToDelete = news;
    this.showConfirmDialog = true;
  }

  deleteNews(): void {
    if (this.newsToDelete) {
      this.contentService.deleteNews(this.newsToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.news = this.news.filter(n => n.id !== this.newsToDelete.id);
          this.totalItems--;
          this.calculateCounts();
          this.showConfirmDialog = false;
          this.newsToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.news.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadNews();
          }
        },
        (error) => {
          console.error('Error deleting news:', error);
          this.showConfirmDialog = false;
          this.newsToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.newsToDelete = null;
  }
}