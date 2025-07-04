import { Component, OnInit } from '@angular/core';
import { DormitoryService } from '../../../services/dormitory.service';
import { CityService } from '../../../services/city.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dormitory-list',
  templateUrl: './dormitory-list.component.html',
  styleUrls: ['./dormitory-list.component.scss']
})
export class DormitoryListComponent implements OnInit {
  dormitories: any[] = [];
  cities: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    name: '',
    status: '',
    city: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  dormitoryToDelete: any = null;
  
  // For use in template calculations
  Math = Math;

  constructor(
    private dormitoryService: DormitoryService,
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadDormitories();
  }

  loadCities(): void {
    this.cityService.getCities().subscribe(
      (data: any) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error loading cities:', error);
      }
    );
  }

  loadDormitories(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.dormitoryService.getDormitories(params).subscribe(
      (data: any) => {
        this.dormitories = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading dormitories:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.dormitories.filter(d => d.isActive).length;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadDormitories();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      status: '',
      city: ''
    };
    this.currentPage = 1;
    this.loadDormitories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDormitories();
  }

  confirmDelete(dormitory: any): void {
    this.dormitoryToDelete = dormitory;
    this.showConfirmDialog = true;
  }

  deleteDormitory(): void {
    if (this.dormitoryToDelete) {
      this.dormitoryService.deleteDormitory(this.dormitoryToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.dormitories = this.dormitories.filter(d => d.id !== this.dormitoryToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.dormitoryToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.dormitories.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadDormitories();
          }
        },
        (error) => {
          console.error('Error deleting dormitory:', error);
          this.showConfirmDialog = false;
          this.dormitoryToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.dormitoryToDelete = null;
  }

  navigateToMenus(dormitory: any): void {
    this.router.navigate(['/admin/dormitories/menus', dormitory.id]);
  }
}