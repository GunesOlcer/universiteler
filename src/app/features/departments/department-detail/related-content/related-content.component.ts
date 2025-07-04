// src/app/features/departments/department-detail/related-content/related-content.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../../../../core/models/department.model';
import { DepartmentService } from '../../../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-related-content',
  templateUrl: './related-content.component.html',
  styleUrls: ['./related-content.component.scss']
})
export class RelatedContentComponent implements OnInit, OnDestroy {
  @Input() department: Department | null = null;
  
  relatedDepartments: Department[] = [];
  popularDepartments: Department[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    if (this.department) {
      this.loadRelatedContent();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRelatedContent(): void {
    this.isLoading = true;
    
    // Load all departments to find related ones
    this.departmentService.getAllDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          this.filterRelatedDepartments(departments);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading related departments:', error);
          this.isLoading = false;
        }
      });

    // Load popular departments
    this.departmentService.getPopularDepartments(4)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          this.popularDepartments = departments.filter(d => d.id !== this.department?.id);
        },
        error: (error) => {
          console.error('Error loading popular departments:', error);
        }
      });
  }

  private filterRelatedDepartments(departments: Department[]): void {
    if (!this.department) return;

    // First, try to find departments from the same faculty
    let related = departments.filter(d => 
      d.id !== this.department!.id && 
      d.facultyName === this.department!.facultyName
    );

    // If we have less than 3, add departments from the same university
    if (related.length < 3) {
      const additionalDepts = departments.filter(d => 
        d.id !== this.department!.id && 
        d.universityName === this.department!.universityName &&
        !related.some(rd => rd.id === d.id)
      );
      related = [...related, ...additionalDepts];
    }

    // If still less than 3, add any other departments
    if (related.length < 3) {
      const moreDepts = departments.filter(d => 
        d.id !== this.department!.id &&
        !related.some(rd => rd.id === d.id)
      );
      related = [...related, ...moreDepts];
    }

    this.relatedDepartments = related.slice(0, 3);
  }

  getDepartmentImageUrl(imagePath?: string): string {
    return this.departmentService.getDepartmentImageUrl(imagePath);
  }

  trackByFn(index: number, item: Department): number {
    return item.id;
  }
}