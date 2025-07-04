// src/app/admin/pages/universities/department-list/department-list.component.ts
import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    name: '',
    status: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  departmentToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.departmentService.getDepartments(params).subscribe(
      (data: any) => {
        this.departments = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.departments.filter(d => d.isActive).length;
  }

  getExamType(type: string): string {
    const types = {
      'sayısal': 'Sayısal',
      'sözel': 'Sözel',
      'eşit ağırlık': 'Eşit Ağırlık',
      'dil': 'Dil',
      'tyt': 'TYT'
    };
    return types[type] || type;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadDepartments();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      status: ''
    };
    this.currentPage = 1;
    this.loadDepartments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDepartments();
  }

  confirmDelete(department: any): void {
    this.departmentToDelete = department;
    this.showConfirmDialog = true;
  }

  deleteDepartment(): void {
    if (this.departmentToDelete) {
      this.departmentService.deleteDepartment(this.departmentToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.departments = this.departments.filter(d => d.id !== this.departmentToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.departmentToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.departments.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadDepartments();
          }
        },
        (error) => {
          console.error('Error deleting department:', error);
          this.showConfirmDialog = false;
          this.departmentToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.departmentToDelete = null;
  }

  navigateToMenus(department: any): void {
    this.router.navigate(['/admin/departments/menus', department.id]);
  }
}