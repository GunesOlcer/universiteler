// src/app/features/departments/department-detail/content/calisma-hayati/calisma-hayati.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Department, DepartmentMenu } from '../../../../../core/models/department.model';
import { DepartmentService } from '../../../../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-calisma-hayati',
  templateUrl: './calisma-hayati.component.html',
  styleUrls: ['./calisma-hayati.component.scss']
})
export class CalismaHayatiComponent implements OnInit, OnDestroy {
  @Input() department: Department | null = null;
  
  departmentMenus: DepartmentMenu[] = [];
  isLoading = false;
  error: string | null = null;
  careerContent: DepartmentMenu | null = null;

  private destroy$ = new Subject<void>();

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    if (this.department) {
      this.loadDepartmentMenus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDepartmentMenus(): void {
    if (!this.department) return;

    this.isLoading = true;
    this.error = null;

    this.departmentService.getDepartmentMenus(this.department.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menus) => {
          this.departmentMenus = menus.filter(menu => 
            menu.isVisible && 
            menu.status === 1 &&
            (menu.title.toLowerCase().includes('çalışma') || 
             menu.title.toLowerCase().includes('kariyer') ||
             menu.title.toLowerCase().includes('career') ||
             menu.title.toLowerCase().includes('iş') ||
             menu.title.toLowerCase().includes('work'))
          );
          
          this.careerContent = this.departmentMenus.find(menu => 
            menu.title.toLowerCase().includes('çalışma hayatı') ||
            menu.title.toLowerCase().includes('career life')
          ) || null;
          
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'İçerik yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error('Error loading department menus:', error);
        }
      });
  }

  retry(): void {
    this.loadDepartmentMenus();
  }

  formatContent(content: string): string {
    if (!content) return '';
    
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>');
  }

  formatSalary(salary?: number): string {
    if (!salary) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(salary);
  }
}