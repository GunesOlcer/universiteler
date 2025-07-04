// src/app/features/departments/departments-list/departments-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Department } from '../../../core/models/department.model';
import { DepartmentService } from '../../../core/services/department.service';
import { Status } from '../../../core/models/base.model';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Filter properties
  searchTerm = '';
  selectedFaculty = '';
  selectedUniversity = '';
  statusFilter: Status | null = null;
  
  // Filter options
  faculties: string[] = [];
  universities: string[] = [];
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['faculty']) {
        this.selectedFaculty = params['faculty'];
      }
      if (params['university']) {
        this.selectedUniversity = params['university'];
      }
      this.loadDepartments();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.error = null;

    this.departmentService.getAllDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          this.departments = departments;
          this.extractFilterOptions();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'Bölümler yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error('Error loading departments:', error);
        }
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onFacultyChange(faculty: string): void {
    this.selectedFaculty = faculty;
    this.applyFilters();
    this.updateUrlParams();
  }

  onUniversityChange(university: string): void {
    this.selectedUniversity = university;
    this.applyFilters();
    this.updateUrlParams();
  }

  onStatusChange(status: Status | null): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFaculty = '';
    this.selectedUniversity = '';
    this.statusFilter = null;
    this.applyFilters();
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: {}
    });
  }

  private extractFilterOptions(): void {
    // Extract unique faculties
    this.faculties = [...new Set(this.departments.map(d => d.facultyName))]
      .filter(name => name)
      .sort();

    // Extract unique universities
    this.universities = [...new Set(this.departments.map(d => d.universityName))]
      .filter(name => name)
      .sort();
  }

  private applyFilters(): void {
    let filtered = [...this.departments];

    // Search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(search) || 
        d.facultyName.toLowerCase().includes(search) ||
        d.universityName.toLowerCase().includes(search) ||
        (d.description && d.description.toLowerCase().includes(search))
      );
    }

    // Faculty filter
    if (this.selectedFaculty) {
      filtered = filtered.filter(d => d.facultyName === this.selectedFaculty);
    }

    // University filter
    if (this.selectedUniversity) {
      filtered = filtered.filter(d => d.universityName === this.selectedUniversity);
    }

    // Status filter
    if (this.statusFilter !== null) {
      filtered = filtered.filter(d => d.status === this.statusFilter);
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    this.filteredDepartments = filtered;
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.selectedFaculty) queryParams.faculty = this.selectedFaculty;
    if (this.selectedUniversity) queryParams.university = this.selectedUniversity;

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getStatusName(status: Status): string {
    switch (status) {
      case Status.Active: return 'Aktif';
      case Status.Passive: return 'Pasif';
      case Status.Pending: return 'Beklemede';
      default: return 'Bilinmiyor';
    }
  }

  retry(): void {
    this.loadDepartments();
  }
}