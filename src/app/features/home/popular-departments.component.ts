// src/app/features/home/popular-departments/popular-departments.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../../core/models/department.model';
import { DepartmentService } from '../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-popular-departments',
  templateUrl: './popular-departments.component.html',
  styleUrls: ['./popular-departments.component.scss']
})
export class PopularDepartmentsComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.error = null;

    this.departmentService.getPopularDepartments(6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          this.departments = departments;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'Popüler bölümler yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error('Error loading popular departments:', error);
        }
      });
  }

  retry(): void {
    this.loadDepartments();
  }

  trackByFn(index: number, item: Department): number {
    return item.id;
  }
}