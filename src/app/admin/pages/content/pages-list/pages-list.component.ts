import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {
  pages: any[] = [];
  dynamicMenus: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    title: '',
    status: '',
    dynamicMenuId: ''
  };
  
  showConfirmDialog = false;
  pageToDelete: any = null;
  
  // Added for modern UI
  filterPanelOpen = true;
  Math = Math;

  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDynamicMenus();
    this.loadPages();
  }

  // Yeni sayfa ekle butonu için metod
  navigateToAddPage(): void {
    this.router.navigate(['/admin/pages/add']);
  }

  loadDynamicMenus(): void {
    this.contentService.getDynamicMenus().subscribe(
      (data: any) => {
        this.dynamicMenus = data;
      },
      (error) => {
        console.error('Error loading dynamic menus:', error);
      }
    );
  }

  loadPages(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.contentService.getPages(params).subscribe(
      (data: any) => {
        this.pages = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading pages:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.pages.filter(p => p.isActive).length;
  }

  getMenuNames(menuIds: number[]): string {
    if (!menuIds || menuIds.length === 0) return '-';
    
    return menuIds.map(id => {
      const menu = this.dynamicMenus.find(m => m.id === id);
      return menu ? menu.title : '';
    }).filter(Boolean).join(', ');
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPages();
  }

  resetFilters(): void {
    this.filters = {
      title: '',
      status: '',
      dynamicMenuId: ''
    };
    this.currentPage = 1;
    this.loadPages();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPages();
  }

  confirmDelete(page: any): void {
    this.pageToDelete = page;
    this.showConfirmDialog = true;
  }

  deletePage(): void {
    if (this.pageToDelete) {
      this.contentService.deletePage(this.pageToDelete.id).subscribe(
        () => {
          this.pages = this.pages.filter(p => p.id !== this.pageToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.pageToDelete = null;
          
          if (this.pages.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadPages();
          }
        },
        (error) => {
          console.error('Error deleting page:', error);
          this.showConfirmDialog = false;
          this.pageToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.pageToDelete = null;
  }
}